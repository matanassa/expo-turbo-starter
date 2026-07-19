# Expo Monorepo Starter

An open-source starter for building Expo applications in a small, typed pnpm monorepo. It ships
with one Expo Router app and three intentionally narrow workspace packages:

- `@starter/theme` for semantic light/dark design tokens;
- `@starter/ui` for accessible React Native primitives styled with Unistyles;
- `@starter/utils` for portable TypeScript utilities; and
- `@starter/mobile-app` as the example app and native configuration owner.

The starter targets Expo SDK 57, React Native 0.86, pnpm 10, TypeScript, Turborepo, Jest, and React
Native Testing Library. Workspace packages are consumed from source, so package edits appear in
Metro without a manual build.

## Architecture

```text
apps/
  mobile-app/
    src/app/          Thin Expo Router route files
    src/screens/      App-owned screens and behavior
    src/theme/        App-owned Unistyles registration
packages/
  theme/              Tokens and typed light/dark themes
  ui/                 Shared React Native components
  utils/              Runtime-independent TypeScript helpers
```

Dependencies point toward the app:

```text
theme ─┐
       ├─> ui ─> mobile-app
utils ─┘       └> mobile-app
```

Shared packages never import application source. Consumers import public package entrypoints and
never reach into another workspace's `src` directory.

## Create a project from the template

Use GitHub's **Use this template** action (once enabled on your fork), or clone/copy the repository.
Then customize the placeholders before installing dependencies:

```sh
pnpm run setup
pnpm install --frozen-lockfile
pnpm check
pnpm ios
```

The interactive setup asks for the repository/package scope and Expo application identifiers. It
is idempotent and can also run non-interactively:

```sh
pnpm run setup --yes \
  --repo-name acme-mobile \
  --scope @acme \
  --app-name "Acme Mobile" \
  --app-slug acme-mobile \
  --app-scheme acme-mobile \
  --ios-bundle-id com.acme.mobile \
  --android-package com.acme.mobile
```

Run `pnpm run setup --help` for every option. Commit the generated `.template-initialized.json`
file;
it records the non-secret values selected for the project.

## Requirements

- Node 24 (see `.nvmrc`)
- pnpm 10.11.1 (pinned in `package.json`)
- Xcode for iOS native builds
- Android Studio and an Android SDK for Android native builds

With Corepack available, activate the pinned pnpm version with `corepack enable`, then run
`corepack install` from the repository root.

Unistyles includes native code, so use the development build created by `pnpm ios` or
`pnpm android`; the app is not intended to run in Expo Go. See the
[Unistyles Expo guide](https://www.unistyl.es/v3/start/getting-started/).

## Commands

| Command               | Purpose                                          |
| --------------------- | ------------------------------------------------ |
| `pnpm dev`            | Start Metro for the installed development client |
| `pnpm ios`            | Build and run the iOS app                        |
| `pnpm android`        | Build and run the Android app                    |
| `pnpm web`            | Start the web app                                |
| `pnpm export:web`     | Produce a static web export                      |
| `pnpm build:packages` | Validate all shared package build boundaries     |
| `pnpm lint`           | Lint every workspace                             |
| `pnpm typecheck`      | Type-check every workspace                       |
| `pnpm test`           | Run all Jest suites                              |
| `pnpm test:packages`  | Run theme, UI, and utils Jest suites             |
| `pnpm test:app`       | Run the application Jest suite                   |
| `pnpm test:watch`     | Watch the application Jest suite                 |
| `pnpm test:coverage`  | Write per-workspace coverage reports             |
| `pnpm expo:doctor`    | Check Expo dependencies and project health       |
| `pnpm expo:config`    | Resolve the public Expo configuration            |
| `pnpm check`          | Run the complete local quality gate              |
| `pnpm clean`          | Remove generated caches, builds, and coverage    |

## Configuration

`apps/mobile-app/app.config.ts` reads non-secret values from the environment and has safe local
fallbacks. Copy `.env.example` to `.env` only when you need to override them. Never commit secrets
or service credentials.

`EAS_PROJECT_ID` is optional. Add it after creating an EAS project; local development and validation
do not require an Expo account.

Expo SDK 52 and newer configure Metro automatically for pnpm monorepos, so this starter does not
carry legacy `watchFolders` or module-resolution overrides. See Expo's
[monorepo guide](https://docs.expo.dev/guides/monorepos/).

## Testing

Jest is configured per workspace so packages remain independently testable:

- theme and utils use `ts-jest` in a Node environment;
- UI uses `jest-expo`, React Native Testing Library, and the Unistyles test mock; and
- the app uses `jest-expo` for consumer-level screen tests.

Colocate focused `*.test.ts` or `*.test.tsx` files with the code they exercise. Prefer rendered
behavior and accessibility assertions over implementation details and snapshots. The CI workflow
runs shared-package and app suites as separate jobs.

## Add another package

1. Create `packages/<name>/package.json` with the current npm scope, `private: true`, and an export
   for `./src/index.ts`.
2. Extend `tsconfig.base.json` from the package's `tsconfig.json`.
3. Add `build`, `lint`, `typecheck`, `test`, `test:watch`, and `test:coverage` scripts.
4. Reference internal dependencies with `workspace:*` and import only their public entrypoints.
5. Add package tests, then run `pnpm install` and `pnpm check`.

## Add another app

1. Scaffold the app under `apps/<name>` with an Expo template compatible with the repository SDK.
2. Give it a scoped workspace name and add internal packages with `workspace:*`.
3. Keep routes thin and register its Unistyles themes from app-owned startup code.
4. Add app-specific Jest, Babel, Expo, and EAS configuration.
5. Add root convenience scripts only when the app is a common target, then run `pnpm check` and
   `pnpm expo:doctor`.

## Contributing and security

Contributions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.
Report vulnerabilities using [SECURITY.md](SECURITY.md), not a public issue.

This project is available under the [MIT License](LICENSE).
