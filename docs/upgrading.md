# Maintaining and Upgrading the Starter

GitHub creates a template consumer with a new, unrelated history. Updating this repository improves
future projects; it does not silently modify applications already created from it.

## Version contract

- The root `package.json` version is the template version.
- `pnpm run setup` records that version in `.template-initialized.json`.
- Every template release updates `CHANGELOG.md` with adoption notes.
- Stable releases receive a `v<version>` Git tag and GitHub release.
- `main` is the supported moving target; security fixes are not backported to old template versions.

Existing applications should compare their recorded version with the changelog, then port relevant
changes as normal application pull requests. Prefer copying small commits or files deliberately over
merging histories that GitHub created as unrelated.

If multiple applications need to receive the same runtime behavior continuously, that behavior has
outgrown the template. Move it into a versioned package or a maintained generator migration instead
of copying it repeatedly.

## Expo upgrade loop

For every Expo SDK upgrade:

1. Create a dedicated branch and update Expo-managed dependencies with `expo install`.
2. Update duplicated React Native test dependencies in shared native packages.
3. Run `pnpm install --frozen-lockfile`, `pnpm check`, `pnpm expo:doctor`,
   `pnpm check:workflows`, and `pnpm verify:template`.
4. Run both platforms through `.eas/workflows/e2e.yml` before tagging the template release.
5. Record native rebuild requirements and downstream migration notes in `CHANGELOG.md`.

Dependabot is an input to this loop, not an automatic compatibility decision. Expo, React, React
Native, Jest, TypeScript, and native modules should move as a tested compatibility set.
