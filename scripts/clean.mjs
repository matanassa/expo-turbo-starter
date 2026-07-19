import { rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const workspaceDirectories = [
  root,
  path.join(root, 'apps/mobile-app'),
  ...['theme', 'ui', 'utils'].map((name) => path.join(root, 'packages', name)),
];
const generatedDirectories = ['.expo', '.turbo', 'build', 'coverage', 'dist'];

for (const workspaceDirectory of workspaceDirectories) {
  for (const generatedDirectory of generatedDirectories) {
    await rm(path.join(workspaceDirectory, generatedDirectory), { force: true, recursive: true });
  }
}

console.log('Removed generated Expo, Turbo, build, and coverage output.');
