import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { ESLint } from 'eslint';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('shared packages cannot deep-import another workspace package', async () => {
  const eslint = new ESLint({ cwd: repositoryRoot });
  const [result] = await eslint.lintText(
    "import { Button } from '@starter/ui/button';\nexport { Button };\n",
    {
      filePath: path.join(repositoryRoot, 'packages/theme/src/example.ts'),
    }
  );

  assert.ok(result);
  assert.ok(result.messages.some((message) => message.ruleId === 'no-restricted-imports'));
});
