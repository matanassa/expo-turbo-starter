# Contributing

Thanks for helping improve the Expo Monorepo Starter.

## Before you start

- Search existing issues and pull requests before opening a duplicate.
- Keep changes focused and avoid product-specific services or branding in the starter.
- For larger architectural changes, open a discussion or feature request before implementation.

## Local development

Use the repository's pinned Node and pnpm versions, then install from the lockfile:

```sh
corepack enable
corepack install
pnpm install --frozen-lockfile
pnpm check
```

Use `pnpm ios`, `pnpm android`, or `pnpm web` to exercise app changes. Because Unistyles uses native
code, native changes must be checked in a development build rather than Expo Go.

## Tests

Add or update a colocated Jest test for behavior changes. Tests should describe observable behavior,
including accessibility and error states for interactive UI. Run the smallest relevant suite while
developing, followed by `pnpm check` before submitting the pull request.

Dependency or Expo configuration changes also require:

```sh
pnpm expo:doctor
pnpm export:web
```

## Pull requests

- Explain the problem and the chosen solution.
- Link related issues.
- Include screenshots or recordings for visual changes.
- Call out any native rebuild, migration, or follow-up requirement.
- Keep the lockfile in sync with manifest changes.

By contributing, you agree that your contributions are licensed under the repository's MIT License.
