# Expo Turbo Starter

> The boring monorepo wiring is done. Build the interesting part.

Most Expo ideas start with the same few hours of work: set up the workspace, make Metro happy,
wire in a theme, add tests, and teach CI how to run it all. This repo skips that part.

It gives you one Expo Router app, three small shared packages, and enough guardrails to keep the
boundaries honest. Auth, data fetching, analytics, and every other product decision are left to you.

## What is in the box

- `apps/mobile-app` — the Expo app, routes, screens, and native configuration
- `packages/theme` — semantic light and dark tokens
- `packages/ui` — accessible React Native building blocks styled with Unistyles
- `packages/utils` — plain TypeScript helpers with no React Native dependency
- Jest, React Native Testing Library, ESLint, Prettier, Turborepo, and GitHub Actions

The starter targets Expo SDK 57, React Native 0.86, Node 24, and pnpm 10. Workspace packages are
consumed from source, so editing a button does not require a separate package build before Metro can
see it.

## Get moving

Start from GitHub's **Use this template** button, or clone the repository, then run:

```sh
pnpm run setup
pnpm install --frozen-lockfile
pnpm check
pnpm ios
```

The setup script asks for your package scope, app name, URL scheme, and native identifiers. It can
also run without prompts:

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

Commit the generated `.template-initialized.json` file. It is a receipt for the non-secret choices
made during setup, and running the command again with the same values is safe.

## The one rule that matters

Dependencies point toward the app:

```text
theme ─┐
       ├─> ui ─> mobile-app
utils ─┘       └> mobile-app
```

Shared packages do not import app code, and consumers use package entrypoints instead of reaching
into another workspace's `src` directory. Route files stay thin; screen bodies live in `src/screens`.

That is most of the architecture. The reasoning and tradeoffs are in
[docs/architecture.md](docs/architecture.md).

## Commands you will actually use

| Command              | What it does                                      |
| -------------------- | ------------------------------------------------- |
| `pnpm dev`           | Start Metro for the development client            |
| `pnpm ios`           | Build and run the iOS app                         |
| `pnpm android`       | Build and run the Android app                     |
| `pnpm web`           | Start the web app                                 |
| `pnpm test`          | Run every Jest suite                              |
| `pnpm test:watch`    | Watch the app Jest suite                          |
| `pnpm test:coverage` | Write coverage reports for every workspace        |
| `pnpm lint`          | Lint every workspace                              |
| `pnpm typecheck`     | Type-check every workspace                        |
| `pnpm check`         | Run the same core quality gate used before a push |
| `pnpm expo:doctor`   | Check Expo dependencies and project health        |
| `pnpm export:web`    | Produce a static web export                       |
| `pnpm clean`         | Remove generated caches, builds, and coverage     |

Run commands from the repository root. Node and pnpm versions are pinned in `.nvmrc` and
`package.json`; with Corepack installed, `corepack enable && corepack install` selects the right
pnpm version.

## A note about Expo Go

The UI package uses Unistyles, which includes native code. Use the development build created by
`pnpm ios` or `pnpm android`; this starter is not an Expo Go project. See the
[Unistyles Expo guide](https://www.unistyl.es/v3/start/getting-started/) if you are new to that
workflow.

Expo handles pnpm monorepos without legacy Metro overrides, so there is no custom `watchFolders`
configuration hiding in the repo. The [Expo monorepo guide](https://docs.expo.dev/guides/monorepos/)
has the details.

## Testing

Tests live beside the code they exercise as `*.test.ts` or `*.test.tsx`:

- theme and utils run in a Node environment with `ts-jest`
- UI and app tests use `jest-expo` and React Native Testing Library
- CI keeps package tests and app tests separate, so failures are easy to place

Prefer behavior and accessibility assertions over snapshots. If you change Expo dependencies or
configuration, run both `pnpm expo:doctor` and `pnpm export:web` before opening a pull request.

## Make it yours

The starter is deliberately missing authentication, an API client, state management, analytics,
and a folder full of pretend product code. Add those when your app asks for them.

Non-secret Expo values live in `apps/mobile-app/app.config.ts` with local fallbacks. Copy
`.env.example` to `.env` when you need overrides, and add `EAS_PROJECT_ID` only after creating an EAS
project.

Found a rough edge or have a useful idea? Read [CONTRIBUTING.md](CONTRIBUTING.md) and open an issue or
pull request. Please report security problems through [SECURITY.md](SECURITY.md), not a public issue.

MIT licensed. Go make something good.
