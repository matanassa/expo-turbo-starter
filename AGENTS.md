# Expo Turbo Starter

## Workspace

- Run pnpm commands from the repository root.
- Use Node 24 and pnpm 10.11.1, as pinned by the repository.
- This starter targets Expo SDK 57 and React Native 0.86.
- The Expo Router app lives in `apps/mobile-app`.
- Shared packages live in `packages/theme`, `packages/ui`, and `packages/utils`.
- Internal dependencies use `workspace:*`; packages import public entrypoints, never another
  workspace's source files.

## Code boundaries

- Keep `apps/mobile-app/src/app` routes-only. Put screen bodies and behavior in `src/screens`.
- The app owns native configuration, product decisions, and Unistyles registration.
- EAS workflows live under `apps/mobile-app/.eas/workflows` and stay manual by default in the
  unlinked template.
- Shared UI may consume theme and utils, but must not configure global themes or import app code.
- Utils stay runtime-independent. Do not add React or React Native dependencies there.
- Colocate tests as `*.test.ts` or `*.test.tsx` and assert observable behavior over implementation
  details or snapshots.

## Working in the repository

- Create package boilerplate with `pnpm generate package <name>`. Use `--kind react-native` only
  when the package needs React Native or Expo APIs.
- Treat adding a second app as an architecture change. This starter currently configures, tests, and
  exposes root commands for one app.
- Do not add authentication, networking, analytics, state management, or other product stacks unless
  the task calls for them.
- Do not add legacy Metro workspace overrides without a concrete resolution problem; modern Expo
  supports pnpm monorepos directly.
- Do not run `pnpm run setup` in an initialized project unless the task is explicitly changing the
  workspace scope or Expo identifiers.
- Unistyles includes native code. Use a development build instead of Expo Go when exercising native
  behavior.

## Verification

- Documentation-only changes: run `pnpm format:check`.
- Code changes: run `pnpm check`.
- Dependency or Expo configuration changes: also run `pnpm expo:doctor` and `pnpm export:web`.
- EAS workflow changes: also run `pnpm check:workflows`.
- Initialization, identity, workspace, or toolchain changes: also run `pnpm verify:template`.
- Generator changes: cover filesystem behavior with `pnpm test:scripts` and smoke-test both package
  kinds in a temporary workspace.
- Report what was verified and call out anything that could not be run.
