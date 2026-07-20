import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { cp, mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

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

async function createTemplateCopy() {
  const parentDirectory = await mkdtemp(path.join(tmpdir(), 'expo-turbo-initializer-'));
  const workspace = path.join(parentDirectory, 'workspace');

  await cp(repositoryRoot, workspace, {
    recursive: true,
    filter: (source) => !generatedDirectoryNames.has(path.basename(source)),
  });

  return { parentDirectory, workspace };
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'));
}

async function initialize(workspace) {
  return execFileAsync(
    process.execPath,
    [
      'scripts/initialize-template.mjs',
      '--yes',
      '--repo-name',
      'acme-mobile',
      '--scope',
      '@acme',
      '--app-name',
      'Acme Mobile',
      '--app-slug',
      'acme-mobile',
      '--app-scheme',
      'acme-mobile',
      '--ios-bundle-id',
      'com.acme.mobile',
      '--android-package',
      'com.acme.mobile',
    ],
    { cwd: workspace }
  );
}

test('records the template version when initializing a new project', async (context) => {
  const { parentDirectory, workspace } = await createTemplateCopy();
  context.after(() => rm(parentDirectory, { force: true, recursive: true }));

  const sourceManifest = await readJson(path.join(workspace, 'package.json'));

  await initialize(workspace);

  const initializationRecord = await readJson(path.join(workspace, '.template-initialized.json'));

  assert.equal(initializationRecord.templateVersion, sourceManifest.version);
});

test('updates the app identity defaults used by Expo configuration', async (context) => {
  const { parentDirectory, workspace } = await createTemplateCopy();
  context.after(() => rm(parentDirectory, { force: true, recursive: true }));

  await initialize(workspace);

  const appIdentitySource = await readFile(
    path.join(workspace, 'apps/mobile-app/app.config.ts'),
    'utf8'
  );

  assert.match(appIdentitySource, /androidPackage: 'com\.acme\.mobile'/);
  assert.match(appIdentitySource, /iosBundleIdentifier: 'com\.acme\.mobile'/);
  assert.doesNotMatch(appIdentitySource, /com\.example\.expoturbostarter/);

  const smokeFlow = await readFile(
    path.join(workspace, 'apps/mobile-app/.maestro/smoke.yml'),
    'utf8'
  );
  assert.match(smokeFlow, /assertVisible: 'Acme Mobile'/);

  const environmentExample = await readFile(path.join(workspace, '.env.example'), 'utf8');
  assert.match(environmentExample, /# APP_ENV=development/);
});
