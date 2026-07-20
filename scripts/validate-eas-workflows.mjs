import { readFile } from 'node:fs/promises';
import path from 'node:path';

import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { load as loadYaml } from 'js-yaml';

const schemaUrl = 'https://api.expo.dev/v2/workflows/schema';
const workflowFiles = process.argv.slice(2);

if (workflowFiles.length === 0) {
  throw new Error('Provide at least one EAS workflow file to validate.');
}

const response = await fetch(schemaUrl);

if (!response.ok) {
  throw new Error(`Could not fetch the EAS workflow schema (${response.status}).`);
}

const body = await response.json();
const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);
const validate = ajv.compile(body.data);

for (const workflowFile of workflowFiles) {
  const source = await readFile(path.resolve(workflowFile), 'utf8');
  const workflow = loadYaml(source);

  if (!validate(workflow)) {
    const details = ajv.errorsText(validate.errors, { separator: '\n' });
    throw new Error(`${workflowFile} does not match the current EAS workflow schema:\n${details}`);
  }

  console.log(`Validated ${workflowFile}`);
}
