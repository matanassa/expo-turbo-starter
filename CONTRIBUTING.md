# Contributing

Found a rough edge? Great. A starter gets better when people try to build real things with it.

Small fixes can go straight to a pull request. If you want to change a package boundary, add a major
dependency, or make a product choice for everyone using the template, open an issue first so we can
talk through the tradeoff.

## Work on the repo

Use the pinned Node and pnpm versions, then install from the lockfile:

```sh
corepack enable
corepack install
pnpm install --frozen-lockfile
pnpm check
```

Use `pnpm ios`, `pnpm android`, or `pnpm web` to try app changes. Unistyles contains native code, so
check native work in a development build rather than Expo Go.

Tests belong beside the behavior they cover. Run the smallest useful Jest suite while working, then
run `pnpm check` before you send the change. Dependency or Expo configuration changes also need:

```sh
pnpm expo:doctor
pnpm export:web
```

## Send a useful pull request

Tell us what felt wrong and why your change makes it better. Add screenshots for visual work, keep
the lockfile in sync, and mention anything that requires a native rebuild or migration. Focused pull
requests are much easier to understand and merge.

Please keep product-specific services and branding out of the starter. The goal is a strong place to
begin, not a demo app everyone has to dismantle.

Contributions are licensed under the repository's MIT License.
