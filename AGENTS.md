# Expo Turbo Starter

## Workspace

- Use pnpm from the repository root.
- Use Node 24 and pnpm 10.11.1, as pinned by the repository.
- This starter targets Expo SDK 57 and React Native 0.86.
- The Expo Router app lives in `apps/mobile-app`.
- Shared packages are `packages/theme`, `packages/ui`, and `packages/utils`.
- Internal imports use package entrypoints and `workspace:*`; packages never import app source.
- Create shared package boilerplate with `pnpm generate package <name>`; use
  `--kind react-native` only for packages that need React Native or Expo APIs.

## Structure

- Keep `apps/mobile-app/src/app` routes-only.
- Put screen bodies under `apps/mobile-app/src/screens`.
- Keep tests colocated as `*.test.ts` or `*.test.tsx`.
- The app owns Unistyles registration; shared UI must not configure global themes.

## Quality gate

Run `pnpm check` before finishing code changes. Run `pnpm expo:doctor` when dependency or Expo
configuration changes.
