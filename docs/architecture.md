# Architecture

This starter has one architectural rule: dependencies point toward the app.

```text
@starter/theme ─┐
                 ├─> @starter/ui ─> @starter/mobile-app
@starter/utils ─┘                  └> @starter/mobile-app
```

It is a small rule, but it prevents the monorepo from turning into a knot as the product grows.

## The app owns product decisions

`apps/mobile-app` owns navigation, screens, native configuration, and Unistyles registration. Expo
Router files under `src/app` only connect a URL to a screen; the screen body belongs under
`src/screens` where it is easier to test and move.

The app is also the right home for choices that are not universal: authentication, API clients,
state management, analytics, feature flags, and error reporting.

## Packages have one job

`@starter/theme` contains semantic design tokens and the typed light and dark themes. It has no React
or React Native dependency.

`@starter/utils` contains runtime-independent TypeScript helpers. If a helper needs a native module,
it does not belong here.

`@starter/ui` turns the theme into accessible React Native primitives. It may depend on theme and
utils, but it never registers global themes or imports from the app.

All internal imports go through package entrypoints. Deep imports save a few keystrokes today and
make package boundaries imaginary tomorrow.

## Why packages export source

The workspace packages are private and used only by apps in this repo, so their exports point at
TypeScript source. Metro and TypeScript can consume that source directly, which keeps local changes
fast and avoids a second build process during development.

The package `build` scripts are still useful: they validate each package boundary with TypeScript.
If a package is ever published to npm, give it a real output directory and an explicit publishing
contract instead of quietly changing the private-package setup.

## Why there is no custom Metro config

Modern Expo understands pnpm workspaces. Legacy `watchFolders`, `extraNodeModules`, and forced module
resolution usually hide dependency mistakes and make upgrades harder, so this repo starts without
them. Add Metro configuration only for a concrete app requirement.

## Why Jest is configured per workspace

The packages do not all run in the same environment. Theme and utils use a plain Node test setup;
UI and the app use `jest-expo` and React Native Testing Library. Keeping those configs local means a
package can explain its own runtime instead of inheriting one giant root mock file.

CI runs shared-package tests and app tests in separate jobs for the same reason: a red check should
tell you where to start looking.

## Adding to the workspace

For a package, start with `pnpm generate package <name>`. Use the `react-native` kind only when the
package needs React Native or Expo APIs. Add internal dependencies with `workspace:*` and export only
the public entrypoint.

For another app, keep its routes and theme registration app-owned. Add app-specific Expo, Babel,
Jest, and EAS configuration rather than teaching shared packages about a particular consumer.

Then run `pnpm install`, `pnpm check`, and—for app or dependency changes—`pnpm expo:doctor`.
