import assert from 'node:assert/strict';
import { execFile, spawn } from 'node:child_process';
import { cp, mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const execFileAsync = promisify(execFile);
const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const generatedDirectoryNames = new Set([
  '.expo',
  '.git',
  '.turbo',
  'android',
  'coverage',
  'dist',
  'ios',
  'node_modules',
]);
const initializationArguments = [
  'scripts/initialize-template.mjs',
  '--yes',
  '--repo-name',
  'canary-mobile',
  '--scope',
  '@canary',
  '--app-name',
  'Canary Mobile',
  '--app-slug',
  'canary-mobile',
  '--app-scheme',
  'canary-mobile',
  '--ios-bundle-id',
  'com.canary.mobile',
  '--android-package',
  'com.canary.mobile',
];

function run(command, arguments_, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, arguments_, {
      cwd,
      env: { ...process.env, CI: 'true' },
      stdio: 'inherit',
    });

    child.once('error', reject);
    child.once('exit', (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} exited with ${code ?? signal ?? 'an unknown status'}.`));
    });
  });
}

const temporaryParent = await mkdtemp(path.join(tmpdir(), 'expo-turbo-canary-'));
const workspace = path.join(temporaryParent, 'workspace');

try {
  await cp(repositoryRoot, workspace, {
    recursive: true,
    filter: (source) => !generatedDirectoryNames.has(path.basename(source)),
  });

  await run(process.execPath, initializationArguments, workspace);

  const secondInitialization = await execFileAsync(process.execPath, initializationArguments, {
    cwd: workspace,
  });
  assert.match(secondInitialization.stdout, /Template already matches the requested configuration/);

  const initializationRecord = JSON.parse(
    await readFile(path.join(workspace, '.template-initialized.json'), 'utf8')
  );
  const sourceManifest = JSON.parse(
    await readFile(path.join(repositoryRoot, 'package.json'), 'utf8')
  );
  const appIdentitySource = await readFile(
    path.join(workspace, 'apps/mobile-app/app.config.ts'),
    'utf8'
  );

  assert.equal(initializationRecord.scope, '@canary');
  assert.equal(initializationRecord.templateVersion, sourceManifest.version);
  assert.doesNotMatch(appIdentitySource, /com\.example\.expoturbostarter/);

  await run('pnpm', ['install', '--frozen-lockfile'], workspace);
  await run('pnpm', ['check'], workspace);
  await run('pnpm', ['expo:doctor'], workspace);
  await run('pnpm', ['export:web'], workspace);
  await run(
    'pnpm',
    ['--dir', 'apps/mobile-app', 'exec', 'expo', 'prebuild', '--no-install', '--clean'],
    workspace
  );

  console.log('Generated-template canary passed.');
} finally {
  await rm(temporaryParent, { force: true, recursive: true });
}
