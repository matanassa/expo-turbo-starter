import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { createInterface } from 'node:readline/promises';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const optionNames = {
  'android-package': 'androidPackage',
  'app-name': 'appName',
  'app-scheme': 'appScheme',
  'app-slug': 'appSlug',
  'ios-bundle-id': 'iosBundleId',
  'repo-name': 'repoName',
  scope: 'scope',
};

const help = `Customize a new Expo monorepo starter copy.

Usage:
  pnpm run setup [options]

Options:
  --repo-name <name>
  --scope <@scope>
  --app-name <display name>
  --app-slug <slug>
  --app-scheme <scheme>
  --ios-bundle-id <identifier>
  --android-package <package>
  --yes                         Accept defaults for omitted values
  --help                        Show this help
`;

function parseArguments(argv) {
  const options = { help: false, yes: false };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];

    if (argument === '--yes') {
      options.yes = true;
      continue;
    }

    if (argument === '--help') {
      options.help = true;
      continue;
    }

    if (!argument?.startsWith('--')) {
      throw new Error(`Unknown argument: ${argument}`);
    }

    const name = argument.slice(2);
    const optionName = optionNames[name];
    const value = argv[index + 1];

    if (!optionName || !value || value.startsWith('--')) {
      throw new Error(`Expected a value for --${name}`);
    }

    options[optionName] = value;
    index += 1;
  }

  return options;
}

function parseEnvironmentExample(source) {
  return Object.fromEntries(
    source
      .split('\n')
      .filter((line) => line && !line.startsWith('#'))
      .map((line) => {
        const separator = line.indexOf('=');
        return [line.slice(0, separator), line.slice(separator + 1)];
      })
  );
}

function validate(values) {
  const rules = [
    ['Repository name', values.repoName, /^[a-z0-9][a-z0-9._-]*$/],
    ['npm scope', values.scope, /^@[a-z0-9][a-z0-9._-]*$/],
    ['App name', values.appName, /^.{1,50}$/],
    ['App slug', values.appSlug, /^[a-z0-9][a-z0-9-]*$/],
    ['App scheme', values.appScheme, /^[a-z][a-z0-9+.-]*$/],
    ['iOS bundle identifier', values.iosBundleId, /^[A-Za-z][A-Za-z0-9-]*(\.[A-Za-z0-9-]+)+$/],
    ['Android package', values.androidPackage, /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/],
  ];

  for (const [label, value, expression] of rules) {
    if (!expression.test(value)) {
      throw new Error(`${label} is invalid: ${value}`);
    }
  }
}

async function promptForValues(options, defaults) {
  if (options.yes) {
    return { ...defaults, ...options };
  }

  const prompt = createInterface({ input: process.stdin, output: process.stdout });
  const ask = async (label, key) => {
    const answer = await prompt.question(`${label} (${options[key] ?? defaults[key]}): `);
    return answer.trim() || options[key] || defaults[key];
  };

  try {
    return {
      repoName: await ask('Repository name', 'repoName'),
      scope: await ask('npm scope', 'scope'),
      appName: await ask('App display name', 'appName'),
      appSlug: await ask('Expo slug', 'appSlug'),
      appScheme: await ask('URL scheme', 'appScheme'),
      iosBundleId: await ask('iOS bundle identifier', 'iosBundleId'),
      androidPackage: await ask('Android package', 'androidPackage'),
    };
  } finally {
    prompt.close();
  }
}

async function writeIfChanged(filePath, nextSource, changedFiles) {
  const currentSource = await readFile(filePath, 'utf8');

  if (currentSource === nextSource) {
    return;
  }

  await writeFile(filePath, nextSource);
  changedFiles.push(path.relative(root, filePath));
}

async function replaceInTextFiles(directory, replacements, changedFiles) {
  const entries = await readdir(directory, { withFileTypes: true });
  const supportedExtensions = new Set([
    '.cjs',
    '.js',
    '.json',
    '.md',
    '.mjs',
    '.ts',
    '.tsx',
    '.yaml',
    '.yml',
  ]);

  for (const entry of entries) {
    if (
      ['.expo', '.git', '.turbo', 'build', 'coverage', 'dist', 'node_modules'].includes(entry.name)
    ) {
      continue;
    }

    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      await replaceInTextFiles(entryPath, replacements, changedFiles);
      continue;
    }

    if (!supportedExtensions.has(path.extname(entry.name))) {
      continue;
    }

    const source = await readFile(entryPath, 'utf8');
    const nextSource = replacements.reduce(
      (result, [from, to]) => result.replaceAll(from, to),
      source
    );

    if (nextSource !== source) {
      await writeFile(entryPath, nextSource);
      changedFiles.push(path.relative(root, entryPath));
    }
  }
}

function replaceConfigFallback(source, environmentName, value) {
  const expression = new RegExp(`(process\\.env\\.${environmentName} \\?\\? ')[^']+(')`);
  return source.replace(expression, `$1${value}$2`);
}

const options = parseArguments(process.argv.slice(2));

if (options.help) {
  console.log(help);
  process.exit(0);
}

const environmentPath = path.join(root, '.env.example');
const environmentSource = await readFile(environmentPath, 'utf8');
const environment = parseEnvironmentExample(environmentSource);
const rootPackagePath = path.join(root, 'package.json');
const rootPackage = JSON.parse(await readFile(rootPackagePath, 'utf8'));
const themePackage = JSON.parse(
  await readFile(path.join(root, 'packages/theme/package.json'), 'utf8')
);
const currentScope = themePackage.name.slice(0, themePackage.name.indexOf('/'));

const defaults = {
  repoName: rootPackage.name,
  scope: currentScope,
  appName: environment.APP_NAME,
  appSlug: environment.APP_SLUG,
  appScheme: environment.APP_SCHEME,
  iosBundleId: environment.IOS_BUNDLE_IDENTIFIER,
  androidPackage: environment.ANDROID_PACKAGE,
};
const values = await promptForValues(options, defaults);
validate(values);

const changedFiles = [];

await replaceInTextFiles(
  root,
  currentScope === values.scope ? [] : [[currentScope, values.scope]],
  changedFiles
);

const updatedRootPackage = JSON.parse(await readFile(rootPackagePath, 'utf8'));
updatedRootPackage.name = values.repoName;
await writeIfChanged(
  rootPackagePath,
  `${JSON.stringify(updatedRootPackage, null, 2)}\n`,
  changedFiles
);

const appConfigPath = path.join(root, 'apps/mobile-app/app.config.ts');
let appConfig = await readFile(appConfigPath, 'utf8');
appConfig = replaceConfigFallback(appConfig, 'APP_NAME', values.appName);
appConfig = replaceConfigFallback(appConfig, 'APP_SLUG', values.appSlug);
appConfig = replaceConfigFallback(appConfig, 'APP_SCHEME', values.appScheme);
appConfig = replaceConfigFallback(appConfig, 'IOS_BUNDLE_IDENTIFIER', values.iosBundleId);
appConfig = replaceConfigFallback(appConfig, 'ANDROID_PACKAGE', values.androidPackage);
await writeIfChanged(appConfigPath, appConfig, changedFiles);

const appNameFiles = [
  'apps/mobile-app/src/screens/home/home-screen.tsx',
  'apps/mobile-app/src/screens/home/home-screen.test.tsx',
];

for (const appNameFile of appNameFiles) {
  const appNameFilePath = path.join(root, appNameFile);
  const appNameFileSource = await readFile(appNameFilePath, 'utf8');
  await writeIfChanged(
    appNameFilePath,
    appNameFileSource.replaceAll(defaults.appName, values.appName),
    changedFiles
  );
}

const nextEnvironment = [
  `APP_NAME=${values.appName}`,
  `APP_SLUG=${values.appSlug}`,
  `APP_SCHEME=${values.appScheme}`,
  `IOS_BUNDLE_IDENTIFIER=${values.iosBundleId}`,
  `ANDROID_PACKAGE=${values.androidPackage}`,
  '# EAS_PROJECT_ID=',
  '',
].join('\n');
await writeIfChanged(environmentPath, nextEnvironment, changedFiles);

const initializationRecordPath = path.join(root, '.template-initialized.json');
const initializationRecord = `${JSON.stringify(
  values,
  ['repoName', 'scope', 'appName', 'appSlug', 'appScheme', 'iosBundleId', 'androidPackage'],
  2
)}\n`;

try {
  await writeIfChanged(initializationRecordPath, initializationRecord, changedFiles);
} catch (error) {
  if (error.code !== 'ENOENT') {
    throw error;
  }

  await writeFile(initializationRecordPath, initializationRecord);
  changedFiles.push(path.relative(root, initializationRecordPath));
}

if (changedFiles.length === 0) {
  console.log('Template already matches the requested configuration.');
} else {
  console.log('Updated template configuration:');
  for (const file of [...new Set(changedFiles)].sort()) {
    console.log(`- ${file}`);
  }
  console.log('\nRun pnpm install --frozen-lockfile to install workspace dependencies.');
}
