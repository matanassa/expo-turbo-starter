import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const help = `Generate workspace boilerplate without installing dependencies.

Usage:
  pnpm generate package <name> [options]

Options:
  --kind <typescript|react-native>  Package kind (default: typescript)
  --help                            Show this help
`;

const packageScripts = {
  build: 'tsc --noEmit',
  lint: 'eslint src --max-warnings=0',
  typecheck: 'tsc --noEmit',
  test: 'jest --runInBand',
  'test:watch': 'jest --watch',
  'test:coverage': 'jest --coverage --runInBand',
};

function parseArguments(arguments_) {
  if (arguments_.length === 0 || arguments_.includes('--help')) {
    return { help: true };
  }

  const [resource, packageName, ...options] = arguments_;

  if (resource !== 'package' || !packageName) {
    throw new Error('Usage: pnpm generate package <name> [--kind <typescript|react-native>]');
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(packageName)) {
    throw new Error('Package name must use kebab-case (for example, feature-flags).');
  }

  let kind = 'typescript';

  if (options.length > 0) {
    if (options.length !== 2 || options[0] !== '--kind') {
      throw new Error('Usage: pnpm generate package <name> [--kind <typescript|react-native>]');
    }

    kind = options[1];
  }

  if (!['react-native', 'typescript'].includes(kind)) {
    throw new Error('Package kind must be typescript or react-native.');
  }

  return { help: false, kind, packageName };
}

async function findWorkspaceScope(root) {
  const packagesDirectory = path.join(root, 'packages');
  const entries = await readdir(packagesDirectory, { withFileTypes: true });
  const scopes = new Set();

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    try {
      const manifest = JSON.parse(
        await readFile(path.join(packagesDirectory, entry.name, 'package.json'), 'utf8')
      );
      const match = /^(@[^/]+)\//.exec(manifest.name);

      if (match) {
        scopes.add(match[1]);
      }
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  if (scopes.size === 0) {
    throw new Error(
      'Could not find a scoped package under packages/. Run this from the repo root.'
    );
  }

  if (scopes.size > 1) {
    throw new Error(`Workspace packages use multiple scopes: ${[...scopes].sort().join(', ')}.`);
  }

  return [...scopes][0];
}

async function assertTargetDoesNotExist(packageDirectory, packageName) {
  try {
    await stat(packageDirectory);
    throw new Error(`packages/${packageName} already exists. Choose another package name.`);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
}

function dependencyVersion(manifest, dependency) {
  const version = manifest.dependencies?.[dependency] ?? manifest.devDependencies?.[dependency];

  if (!version) {
    throw new Error(
      `apps/mobile-app must declare ${dependency} to generate a React Native package.`
    );
  }

  return version;
}

async function reactNativeDependencies(root) {
  const appManifest = JSON.parse(
    await readFile(path.join(root, 'apps/mobile-app/package.json'), 'utf8')
  );

  return {
    '@testing-library/react-native': dependencyVersion(
      appManifest,
      '@testing-library/react-native'
    ),
    '@types/react': dependencyVersion(appManifest, '@types/react'),
    expo: dependencyVersion(appManifest, 'expo'),
    jest: dependencyVersion(appManifest, 'jest'),
    'jest-expo': dependencyVersion(appManifest, 'jest-expo'),
    react: dependencyVersion(appManifest, 'react'),
    'react-native': dependencyVersion(appManifest, 'react-native'),
    'test-renderer': dependencyVersion(appManifest, 'test-renderer'),
  };
}

function typeScriptJestConfig() {
  return `module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.test.ts', '!src/index.ts'],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
`;
}

function reactNativeJestConfig() {
  return `module.exports = {
  preset: 'jest-expo',
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/index.ts',
    '!src/**/*.d.ts',
  ],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  transformIgnorePatterns: [
    'node_modules/(?!(.pnpm|(jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*))',
  ],
};
`;
}

function typeScriptConfig(isReactNative) {
  if (isReactNative) {
    return `{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "types": ["jest", "react", "react-native"]
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"]
}
`;
  }

  return `{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "types": ["jest"]
  },
  "include": ["src/**/*.ts"]
}
`;
}

async function packageFiles(root, scopedPackageName, kind) {
  const isReactNative = kind === 'react-native';
  const packageManifest = {
    name: scopedPackageName,
    version: '0.0.0',
    private: true,
    exports: {
      '.': './src/index.ts',
    },
    scripts: packageScripts,
  };

  if (isReactNative) {
    packageManifest.peerDependencies = {
      react: '*',
      'react-native': '*',
    };
    packageManifest.devDependencies = await reactNativeDependencies(root);
  }

  return {
    'package.json': `${JSON.stringify(packageManifest, null, 2)}\n`,
    'tsconfig.json': typeScriptConfig(isReactNative),
    'jest.config.cjs': isReactNative ? reactNativeJestConfig() : typeScriptJestConfig(),
    'src/index.ts': `// Export the package's public API from this file.
export {};
`,
    'src/index.test.ts': `describe('${scopedPackageName}', () => {
  it.todo('exports its first public API');
});
`,
  };
}

async function generatePackage(root, packageName, kind) {
  const scope = await findWorkspaceScope(root);
  const scopedPackageName = `${scope}/${packageName}`;
  const packageDirectory = path.join(root, 'packages', packageName);

  await assertTargetDoesNotExist(packageDirectory, packageName);

  const files = await packageFiles(root, scopedPackageName, kind);

  await mkdir(packageDirectory);
  await mkdir(path.join(packageDirectory, 'src'));
  await Promise.all(
    Object.entries(files).map(([file, source]) =>
      writeFile(path.join(packageDirectory, file), source, 'utf8')
    )
  );

  console.log(`Created ${scopedPackageName} at packages/${packageName}.`);
  console.log('\nNext:');
  console.log('  pnpm install');
  console.log(`  pnpm --filter ${scopedPackageName} test`);
  console.log('  pnpm check');
}

async function main() {
  const options = parseArguments(process.argv.slice(2));

  if (options.help) {
    console.log(help);
    return;
  }

  await generatePackage(process.cwd(), options.packageName, options.kind);
}

try {
  await main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
