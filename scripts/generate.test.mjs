import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const execFileAsync = promisify(execFile);
const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const generatorPath = path.join(repositoryRoot, 'scripts/generate.mjs');

async function createWorkspace() {
  const workspace = await mkdtemp(path.join(tmpdir(), 'expo-turbo-generator-'));
  const themeDirectory = path.join(workspace, 'packages/theme');
  const appDirectory = path.join(workspace, 'apps/mobile-app');

  await mkdir(themeDirectory, { recursive: true });
  await mkdir(appDirectory, { recursive: true });
  await writeFile(
    path.join(themeDirectory, 'package.json'),
    `${JSON.stringify({ name: '@acme/theme' }, null, 2)}\n`
  );
  await writeFile(
    path.join(appDirectory, 'package.json'),
    `${JSON.stringify(
      {
        dependencies: {
          expo: '~57.0.7',
          react: '19.2.3',
          'react-native': '0.86.0',
        },
        devDependencies: {
          '@testing-library/react-native': '14.0.1',
          '@types/react': '~19.2.2',
          jest: '29.7.0',
          'jest-expo': '57.0.2',
          'test-renderer': '1.2.0',
        },
      },
      null,
      2
    )}\n`
  );

  return workspace;
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'));
}

test('generates a TypeScript package with the configured workspace scope', async (context) => {
  const workspace = await createWorkspace();
  context.after(() => rm(workspace, { force: true, recursive: true }));

  const { stdout } = await execFileAsync(
    process.execPath,
    [generatorPath, 'package', 'analytics'],
    {
      cwd: workspace,
    }
  );

  const packageDirectory = path.join(workspace, 'packages/analytics');
  const packageManifest = await readJson(path.join(packageDirectory, 'package.json'));

  assert.equal(packageManifest.name, '@acme/analytics');
  assert.equal(packageManifest.private, true);
  assert.deepEqual(packageManifest.exports, { '.': './src/index.ts' });
  assert.match(stdout, /Created @acme\/analytics/);

  await Promise.all(
    ['jest.config.cjs', 'src/index.test.ts', 'src/index.ts', 'tsconfig.json'].map((file) =>
      readFile(path.join(packageDirectory, file), 'utf8')
    )
  );
});

test('generates a React Native package using versions from the app', async (context) => {
  const workspace = await createWorkspace();
  context.after(() => rm(workspace, { force: true, recursive: true }));

  await execFileAsync(
    process.execPath,
    [generatorPath, 'package', 'maps', '--kind', 'react-native'],
    { cwd: workspace }
  );

  const packageDirectory = path.join(workspace, 'packages/maps');
  const packageManifest = await readJson(path.join(packageDirectory, 'package.json'));
  const tsconfig = await readJson(path.join(packageDirectory, 'tsconfig.json'));
  const jestConfig = await readFile(path.join(packageDirectory, 'jest.config.cjs'), 'utf8');

  assert.deepEqual(packageManifest.peerDependencies, {
    react: '*',
    'react-native': '*',
  });
  assert.deepEqual(packageManifest.devDependencies, {
    '@testing-library/react-native': '14.0.1',
    '@types/react': '~19.2.2',
    expo: '~57.0.7',
    jest: '29.7.0',
    'jest-expo': '57.0.2',
    react: '19.2.3',
    'react-native': '0.86.0',
    'test-renderer': '1.2.0',
  });
  assert.equal(tsconfig.compilerOptions.jsx, 'react-jsx');
  assert.match(jestConfig, /preset: 'jest-expo'/);
});

test('rejects package names that are not kebab-case', async (context) => {
  const workspace = await createWorkspace();
  context.after(() => rm(workspace, { force: true, recursive: true }));

  await assert.rejects(
    execFileAsync(process.execPath, [generatorPath, 'package', '../escape'], { cwd: workspace }),
    (error) => {
      assert.match(error.stderr, /Package name must use kebab-case/);
      return true;
    }
  );

  await assert.rejects(readFile(path.join(workspace, 'escape/package.json'), 'utf8'));
});

test('refuses to overwrite an existing package directory', async (context) => {
  const workspace = await createWorkspace();
  context.after(() => rm(workspace, { force: true, recursive: true }));

  const packageDirectory = path.join(workspace, 'packages/analytics');
  const sentinelPath = path.join(packageDirectory, 'keep-me.txt');
  await mkdir(packageDirectory, { recursive: true });
  await writeFile(sentinelPath, 'original\n');

  await assert.rejects(
    execFileAsync(process.execPath, [generatorPath, 'package', 'analytics'], { cwd: workspace }),
    (error) => {
      assert.match(error.stderr, /packages\/analytics already exists/);
      return true;
    }
  );

  assert.equal(await readFile(sentinelPath, 'utf8'), 'original\n');
  await assert.rejects(readFile(path.join(packageDirectory, 'package.json'), 'utf8'));
});

test('rejects unsupported package kinds', async (context) => {
  const workspace = await createWorkspace();
  context.after(() => rm(workspace, { force: true, recursive: true }));

  await assert.rejects(
    execFileAsync(process.execPath, [generatorPath, 'package', 'analytics', '--kind', 'swift'], {
      cwd: workspace,
    }),
    (error) => {
      assert.match(error.stderr, /Package kind must be typescript or react-native/);
      return true;
    }
  );

  await assert.rejects(readFile(path.join(workspace, 'packages/analytics/package.json'), 'utf8'));
});

test('shows the available generator command without requiring a workspace', async () => {
  const { stdout } = await execFileAsync(process.execPath, [generatorPath, '--help']);

  assert.match(stdout, /pnpm generate package <name>/);
  assert.match(stdout, /--kind <typescript\|react-native>/);
});

test('generates packages that satisfy the repository formatter', async (context) => {
  const workspace = await createWorkspace();
  context.after(() => rm(workspace, { force: true, recursive: true }));

  await execFileAsync(process.execPath, [generatorPath, 'package', 'analytics'], {
    cwd: workspace,
  });
  await execFileAsync(
    process.execPath,
    [generatorPath, 'package', 'maps', '--kind', 'react-native'],
    { cwd: workspace }
  );

  await execFileAsync(
    'pnpm',
    [
      'exec',
      'prettier',
      '--check',
      '--config',
      path.join(repositoryRoot, 'prettier.config.mjs'),
      path.join(workspace, 'packages/analytics'),
      path.join(workspace, 'packages/maps'),
    ],
    { cwd: repositoryRoot }
  );
});
