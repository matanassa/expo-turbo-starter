# Expo Monorepo Starter: Implementation Plan

> **Implementation status (July 19, 2026):** The repository, packages, app, Jest suites,
> initializer, CI, and open-source documentation are implemented and locally validated. The
> GitHub-only publication steps—adding a remote, enabling **Template repository**, and creating the
> first tagged release—remain pending until a destination repository exists.

## 1. Goal

Create an open-source GitHub template for starting a production-shaped Expo monorepo without
bringing along product-specific infrastructure.

The starter will borrow proven boundaries from a production Expo application:

- a pnpm workspace orchestrated by Turborepo;
- one Expo Router app under `apps/mobile-app`;
- separate `theme`, `ui`, and `utils` workspace packages;
- explicit public package entrypoints;
- root commands for development and quality checks; and
- tests and CI that validate both shared packages and their app consumer.

It will be a clean, product-neutral extraction. All source-app branding, business logic,
credentials, service integrations, release-train automation, and domain-specific components must
be excluded.

## 2. Recommended product decision

Ship version 1 as a **GitHub template repository**, not as a set of npm libraries.

The three shared packages should initially be private workspace packages consumed by the included
app. This gives a newly generated project one versioned source tree, instant local package edits,
and no npm organization or publishing setup. The packages should still have clean `exports`, tests,
and build/typecheck commands so npm publishing can be added later without redesigning them.

An optional package-publishing phase is included below. It should only be enabled after the owner
chooses a real npm scope and release policy.

## 3. Version 1 scope

### In scope

- Expo app for iOS, Android, and web.
- Expo Router with typed routes and a `src/app` routes-only boundary.
- Light and dark themes with semantic design tokens.
- A small, tested React Native UI package.
- A framework-independent TypeScript utilities package.
- pnpm workspaces and Turborepo task orchestration.
- TypeScript, ESLint, Prettier, Jest, and React Native Testing Library.
- A minimal GitHub Actions CI workflow.
- EAS-ready app configuration with placeholders and no account-specific identifiers.
- A repository rename/setup script for template users.
- MIT license and basic contribution/security documentation.

### Explicitly out of scope

- Authentication, databases, APIs, analytics, push notifications, payments, maps, or other product
  integrations.
- Additional apps such as Storybook, a separate web app, infrastructure, or back-office tools.
- Domain packages such as application `data`, persistence, and business-helper packages.
- Product fonts, colors, icons, copy, certificates, Firebase files, EAS project IDs, bundle IDs, or
  package scopes.
- Generated `ios/` and `android/` directories. The starter will use Expo Continuous Native
  Generation.
- A component catalog or documentation site in version 1.
- Automatic app-store, OTA, or npm releases.

## 4. Target repository shape

```text
expo-monorepo-starter/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   ├── pull_request_template.md
│   └── workflows/
│       └── ci.yml
├── apps/
│   └── mobile-app/
│       ├── assets/
│       ├── src/
│       │   ├── app/                 # Expo Router route files only
│       │   │   ├── _layout.tsx
│       │   │   ├── +not-found.tsx
│       │   │   └── index.tsx
│       │   ├── screens/
│       │   │   └── home/
│       │   │       └── index.tsx
│       │   └── theme/
│       │       └── unistyles.ts     # App-owned runtime registration
│       ├── app.config.ts
│       ├── babel.config.js
│       ├── eas.json
│       ├── index.ts                 # Router/theme initialization entrypoint
│       ├── package.json
│       └── tsconfig.json
├── packages/
│   ├── theme/
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── ui/
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── utils/
│       ├── src/
│       ├── package.json
│       └── tsconfig.json
├── scripts/
│   └── initialize-template.mjs
├── .env.example
├── .gitignore
├── .npmrc
├── .nvmrc
├── AGENTS.md
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── SECURITY.md
├── eslint.config.mjs
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── prettier.config.mjs
├── tsconfig.base.json
└── turbo.json
```

Keep repository-wide lint and TypeScript configuration at the root rather than introducing extra
configuration packages. That preserves the requested three-package surface: `theme`, `ui`, and
`utils`.

## 5. Package boundaries

The dependency graph must remain one-directional:

```text
@starter/theme ───────┐
                      ├──> @starter/ui ───> mobile-app
@starter/utils ───────┘             └─────> mobile-app
```

More precisely:

- `theme` has no dependency on `ui`, `utils`, or app code.
- `utils` has no React, React Native, Expo, theme, UI, or app dependency.
- `ui` may depend on `theme` and on narrowly justified pure utilities.
- `mobile-app` consumes package public entrypoints only.
- No package may import anything from `apps/mobile-app`.
- Cross-package imports use `workspace:*` and never reach into another package's `src` directory.

### `@starter/theme`

Use plain TypeScript values as the source of truth. Do not configure a styling runtime from this
package.

Initial exports:

- semantic colors for `lightTheme` and `darkTheme`;
- spacing scale and a `spacing()` helper;
- radii;
- typography roles using system fonts by default;
- shadows/elevation values with native and web-safe shapes;
- breakpoints; and
- exported `AppTheme` and token types.

Semantic names such as `background`, `surface`, `text`, `mutedText`, `border`, `primary`,
`onPrimary`, `success`, `warning`, and `danger` should be favored over brand-specific color names.
Every token module gets a small contract test to make accidental shape changes visible.

### `@starter/ui`

Build only enough UI to prove the architecture and give a useful starting point:

- `Text` with accessible scaling and named typography variants;
- `Pressable` with disabled and pressed states;
- `Button` with primary/secondary variants, sizes, loading, and accessibility behavior;
- `Card`;
- `TextInput` and `FormField`; and
- a simple `Screen` container for safe padding and background behavior.

Each component should have:

- one intentional public export;
- explicit props and no app-specific assumptions;
- light/dark theme coverage;
- disabled/loading/error states where applicable;
- accessibility labels, roles, and font scaling preserved by default; and
- colocated rendering and interaction tests.

Use `react-native-unistyles` for the Brew-style typed theme and variants. Keep React, React Native,
Unistyles, and any native support libraries as peer dependencies of `ui`; keep them in development
dependencies only for building and testing the package.

The app must own `StyleSheet.configure`. The package must never register a global theme as an import
side effect. The app's custom entrypoint should load the router and Unistyles configuration in the
documented order before UI modules are evaluated. The Babel configuration must process the UI
workspace package explicitly.

This choice makes version 1 a development-build starter rather than an Expo Go starter because
Unistyles includes native code. State that clearly in the README and provide `pnpm ios` and
`pnpm android` as the primary native run paths.

### `@starter/utils`

Keep this package deliberately boring and portable. Seed it with a few demonstrative utilities,
for example:

- `clamp`;
- `isDefined`;
- `assertNever`; and
- one small formatting helper that does not introduce a large runtime dependency.

Every utility should be pure, individually exported, and covered by edge-case unit tests. Do not
move app hooks, UI helpers, environment access, or business rules into this package.

## 6. App design

Scaffold the app from Expo's current explicit default template rather than copying the Brew app and
deleting pieces. At implementation time, pin the chosen stable SDK template explicitly; do not rely
on `create-expo-app@latest` choosing the intended SDK during an SDK transition.

Use these app boundaries:

- `src/app`: route and layout files only;
- `src/screens`: screen bodies and screen-private components;
- `src/theme/unistyles.ts`: light/dark theme registration and module augmentation;
- `assets`: generic starter icons and splash assets; and
- app-root files: Expo, Babel, EAS, Jest, and TypeScript configuration.

The initial Home screen should act as an integration smoke test. It should render token values and
every starter UI primitive, demonstrate light/dark adaptation, and include a link to a second small
route or the not-found route. It should look intentional, but remain neutral enough to be replaced.

The root layout should contain only platform foundations that almost every app needs: safe-area
handling, status bar behavior, and the root Expo Router stack. Do not add empty provider abstractions
for hypothetical future services.

Use a dynamic `app.config.ts` with safe placeholders for:

- app name;
- slug and URL scheme;
- iOS bundle identifier;
- Android package; and
- optional EAS project ID.

The template initializer will replace those values. No secret should be required to run locally.

## 7. Workspace and package tooling

### Root setup

- Pin a supported Node LTS version and an exact pnpm version.
- Use `apps/*` and `packages/*` workspace globs.
- Use `workspace:*` for all internal dependencies.
- Use pnpm's isolated linker and declare Jest runtime dependencies explicitly in each workspace.
  A clean SDK 57 verification found that the hoisted layout could pair Jest 29's
  `write-file-atomic` with an incompatible `signal-exit` major, while the isolated layout preserves
  each package's dependency graph.
- Let Expo's current `expo/metro-config` perform automatic monorepo detection. Do not copy Brew's
  legacy `watchFolders`, `nodeModulesPaths`, or `disableHierarchicalLookup` overrides unless a
  verified dependency still requires them.
- Let `expo install` choose Expo/RN ecosystem versions compatible with the selected SDK. Avoid a
  large root override table copied from Brew; add an override only for a documented incompatibility.

### Package manifests

For version 1, use a neutral placeholder scope such as `@starter/*`, version `0.0.0`, and
`private: true`. Define the public import surface through `exports`; consumers should import only
from `@starter/theme`, `@starter/ui`, and `@starter/utils`.

Favor source consumption inside the private workspace so editing a package does not require a
manual rebuild before Metro sees the change. Package `build` tasks should still validate types and
the distributable shape. Before enabling npm publication, replace source exports with verified
compiled `dist` exports and run a packed-tarball consumer test.

### Root commands

Provide a small, memorable command surface:

```text
pnpm dev              Start the Expo development server
pnpm ios              Build/run iOS
pnpm android          Build/run Android
pnpm web              Start the web target
pnpm build:packages   Validate/build theme, UI, and utils
pnpm lint             Lint all workspaces
pnpm typecheck        Type-check all workspaces
pnpm test             Run all tests
pnpm test:app         Run the mobile app Jest suite
pnpm test:packages    Run the theme, UI, and utils Jest suites
pnpm test:watch       Run the app Jest suite in watch mode
pnpm test:coverage    Produce per-workspace Jest coverage reports
pnpm check            Run build:packages, lint, typecheck, and test
pnpm clean            Remove generated caches/build output only
pnpm run setup        Customize a fresh template copy
```

Turborepo tasks should declare package builds as dependencies of app typechecking and tests where
compiled output is involved. Development tasks remain uncached and persistent; lint and typecheck
produce no cached output.

### Jest testing strategy

Jest is the required test runner across the entire repository. Keep a small Jest configuration in
each workspace so every package can be tested independently, while Turborepo makes the root
commands run them together.

- `apps/mobile-app` uses `jest-expo` and React Native Testing Library for routes, screens, and app
  integration tests.
- `packages/ui` uses `jest-expo` and React Native Testing Library, with test setup that initializes
  or mocks Unistyles before importing components.
- `packages/theme` and `packages/utils` use Jest's Node environment with a TypeScript transform;
  they must not load an Expo or React Native runtime merely to test plain values and functions.
- Tests are colocated as `*.test.ts` or `*.test.tsx` beside their source files.
- Prefer user-observable rendering and interaction assertions over component internals and large
  snapshots.
- Use module-specifier setup imports that work with pnpm's workspace layout; do not hardcode paths
  into a particular `node_modules` directory.
- Keep coverage reports and thresholds per workspace. Start with meaningful thresholds supported
  by the initial suite and raise them as the starter grows rather than adding placeholder tests.
- The app suite must run when `theme`, `ui`, or `utils` changes because package tests alone do not
  prove that Metro, Babel, module exports, and the app consumer still agree.

In CI, run package Jest suites and the app Jest suite as separate parallel jobs after the shared
install/build step. Do not copy Brew's multi-shard app setup into the small starter suite; add Jest
sharding only when measured test duration justifies it.

Run those two groups sequentially from the root `pnpm test` command. A clean SDK 57 verification
found that launching both React Native Jest runtimes concurrently could stall on local machines;
the dedicated CI jobs retain safe cross-job parallelism.

## 8. Implementation phases

### Phase 1: Repository foundation

1. Add the root pnpm/Turbo workspace files and shared quality configuration.
2. Pin Node and pnpm versions.
3. Add root scripts and a single naming convention for all workspaces.
4. Scaffold the Expo app at `apps/mobile-app` using the explicit current SDK template.
5. Remove template demo code that does not belong in the final architecture.
6. Add the workspace-level Jest configuration and root test orchestration.

Acceptance criteria:

- a clean install succeeds from the repository root;
- Turbo discovers the app and all three packages;
- the app starts without custom legacy Metro resolution; and
- no file contains source-product names or credentials.

### Phase 2: Theme package

1. Implement generic semantic tokens, light/dark themes, breakpoints, and exported types.
2. Add stable public exports and contract tests.
3. Register the themes from the app-owned Unistyles file.
4. Add the custom Expo Router entrypoint and Babel package-processing configuration.

Acceptance criteria:

- both themes are type-safe and have identical keys;
- `theme` builds/tests without importing the app or UI package; and
- the app can resolve the workspace package through its public entrypoint.

### Phase 3: UI package

1. Implement the minimal primitives listed above.
2. Add test setup that registers a test theme before importing styled components.
3. Add accessibility and state tests for every interactive component.
4. Export components through explicit package entrypoints.

Acceptance criteria:

- UI tests cover default, pressed/disabled, loading, input error, and dark-theme paths;
- the package has no app imports or product copy; and
- the app renders the components on iOS, Android, and web.

### Phase 4: Utils package

1. Implement the initial pure utilities.
2. Add edge-case tests and explicit exports.
3. Verify the package has no React Native or app runtime dependency.

Acceptance criteria:

- utilities can execute in plain Node;
- tests pass independently; and
- the app imports at least one utility through `@starter/utils` to prove integration.

### Phase 5: Starter app and configuration

1. Replace the Expo demo with thin routes and a real `HomeScreen` under `src/screens/home`.
2. Demonstrate all shared primitives and both theme modes.
3. Add generic assets, app config, EAS profiles, and `.env.example`.
4. Add focused app smoke tests.

Acceptance criteria:

- route files contain routing concerns rather than reusable UI;
- `expo config` resolves with no secrets;
- native identifiers are safe placeholders; and
- native/web smoke runs exercise the shared package integration.

### Phase 6: CI and open-source hygiene

1. Add CI for install, package build, lint, typecheck, Jest package tests, Jest app tests, Expo
   Doctor, and Expo config validation. Run the two Jest jobs in parallel.
2. Add README setup, architecture, common commands, and "add another app/package" guides.
3. Add MIT `LICENSE`, `CONTRIBUTING.md`, `SECURITY.md`, issue forms, and a PR template.
4. Add dependency/license review and a secret scan.

Acceptance criteria:

- CI passes from a clean checkout;
- contributors can run the project by following only the README;
- dependency licenses are compatible with the repository license; and
- secret scanning and a case-insensitive search find no source-product identifiers or private
  endpoints.

### Phase 7: Template initialization and release

1. Add an idempotent `pnpm run setup` script that asks for repository name, npm scope, display name,
   slug, scheme, iOS bundle ID, and Android package.
2. Validate inputs before editing and print the exact files changed.
3. Remove or mark template-only setup instructions after successful initialization.
4. Test the template by copying it to a temporary directory, running setup, installing from the
   lockfile, and running `pnpm check`.
5. Mark the GitHub repository as a template and create the first tagged release.

Acceptance criteria:

- setup can be rerun without corrupting package names;
- a generated repository contains no `@starter` placeholders;
- the generated app boots and passes `pnpm check`; and
- the release notes clearly state that Unistyles requires a development build, not Expo Go.

## 9. Optional npm publishing phase

If the goal expands from "starter repository" to "starter plus reusable public packages":

1. Choose and verify a real npm scope.
2. Build ESM/CJS and declaration outputs for `theme` and `utils`.
3. Choose and test the React Native library output strategy for `ui`, including Unistyles Babel
   processing instructions for downstream consumers.
4. Add `files`, `exports`, `sideEffects`, peer dependency ranges, and package READMEs.
5. Add Changesets with public access and a GitHub Actions release workflow using npm trusted
   publishing where available.
6. Pack each package with `pnpm pack`, install the tarballs into a clean Expo fixture, and run its
   native/web typecheck and bundle smoke tests.

Do not enable publishing merely because the packages live under `packages/`; template-local
packages and independently versioned libraries are different products with different support
burdens.

## 10. Validation matrix

The final implementation should prove each boundary independently:

| Area      | Required checks                                                                              |
| --------- | -------------------------------------------------------------------------------------------- |
| Root      | frozen-lockfile install, Turbo graph, formatting, secret/name scrub                          |
| Theme     | typecheck, Jest token contract tests, light/dark key parity                                  |
| UI        | typecheck, Jest component tests, accessibility states, app consumer smoke                    |
| Utils     | Node typecheck and Jest unit tests with no React Native runtime                              |
| App       | lint, typecheck, Jest + React Native Testing Library smoke tests, `expo config`, Expo Doctor |
| Platforms | iOS development build, Android development build, web export/start smoke                     |
| Template  | initialize a clean copy, reinstall, run `pnpm check`                                         |

## 11. Definition of done

Version 1 is complete when a new contributor can:

1. use the GitHub template;
2. run `pnpm setup` to apply their identity;
3. install once from the repository root;
4. start the Expo app and build a development client;
5. edit a theme token or UI component and see the app update;
6. run one root `pnpm check` command successfully; and
7. understand from the README where app code, shared UI, theme tokens, and pure utilities belong.

The repository is not done if it still contains private Brew assumptions, requires an undocumented
build order, only works from an existing developer's machine, or exposes workspace internals through
deep imports.

## 12. Reference guidance

- [Expo monorepo guide](https://docs.expo.dev/guides/monorepos/)
- [Expo Router `src` directory](https://docs.expo.dev/router/reference/src-directory/)
- [Create Expo App](https://docs.expo.dev/more/create-expo/)
- [EAS Build with monorepos](https://docs.expo.dev/build-reference/build-with-monorepos/)
- [Unistyles setup](https://www.unistyl.es/v3/start/getting-started/)
- [Unistyles with Expo Router](https://www.unistyl.es/v3/guides/expo-router/)
- [Unistyles guidance for library authors](https://www.unistyl.es/v3/other/for-library-authors/)
