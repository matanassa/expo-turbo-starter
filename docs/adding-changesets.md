# Adding Changesets

Changesets is a good fit when the shared packages need their own versions, changelogs, or npm
releases. It is not installed by default because this starter keeps every workspace package private
and consumes them directly from source.

You can still use Changesets with private packages. That gives the team an explicit release note for
each meaningful change and lets Changesets update package versions and changelogs without publishing
anything.

## 1. Install and initialize it

Run these commands from the repository root:

```sh
pnpm add -Dw @changesets/cli
pnpm changeset init
```

This adds the CLI to the root development dependencies and creates `.changeset/config.json` plus a
short README inside `.changeset`.

## 2. Use a monorepo-friendly config

Replace `.changeset/config.json` with:

```json
{
  "$schema": "https://unpkg.com/@changesets/config/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "restricted",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "bumpVersionsWithWorkspaceProtocolOnly": true,
  "ignore": [],
  "privatePackages": {
    "version": true,
    "tag": false
  }
}
```

The important starter-specific choices are:

- `baseBranch: "main"` matches this repository.
- `bumpVersionsWithWorkspaceProtocolOnly: true` keeps automatic dependency bumps focused on the
  internal `workspace:*` relationships.
- `privatePackages.version: true` lets Changesets version the private app and packages.
- `privatePackages.tag: false` avoids creating release tags for packages that are not published.

If only the shared packages should have versions, select `@starter/theme`, `@starter/ui`, and
`@starter/utils` when creating changesets and leave `@starter/mobile-app` out.

## 3. Add convenient scripts

Add these entries to the root `package.json` scripts:

```json
{
  "scripts": {
    "changeset": "changeset",
    "version-packages": "changeset version",
    "release": "changeset publish"
  }
}
```

`release` will have nothing to publish while package manifests contain `"private": true`. Keeping
the script now makes the later publishing workflow unsurprising.

Run `pnpm install` after editing `package.json`, then commit `package.json`, `pnpm-lock.yaml`, and the
new `.changeset` directory.

## 4. Record a change

For a change that should appear in a changelog, run:

```sh
pnpm changeset
```

Choose the affected packages, choose `patch`, `minor`, or `major`, and write one sentence a package
consumer will understand. Changesets creates a small Markdown file under `.changeset/`; commit that
file with the code change.

Not every pull request needs one. Documentation, CI, tests, and refactors with no consumer-visible
effect can usually skip a changeset.

## 5. Turn pending changes into versions

When a release is ready:

```sh
pnpm version-packages
pnpm install
pnpm check
```

The version command consumes pending changeset files, updates package versions, and writes package
changelogs. `pnpm install` then refreshes the lockfile. Review all of those changes before committing
the release.

## Publishing the packages later

To publish `theme`, `ui`, or `utils` to npm:

1. Choose a real npm scope and run the starter setup script if the packages still use `@starter`.
2. Remove `"private": true` from only the packages you intend to publish. Keep the root and mobile app
   private.
3. Change `access` in `.changeset/config.json` to `public` for public scoped packages.
4. Add package metadata such as `license`, `repository`, and `files`, and replace source-only exports
   with a deliberate build and publishing contract.
5. Authenticate with npm, run `pnpm version-packages`, verify the resulting packages, then run
   `pnpm release`.

Do not remove `private` and publish the current source-export package manifests by accident. The
starter's source exports are designed for this workspace; a public package should define what files
it ships and which JavaScript and type entrypoints consumers receive.

Changesets can also automate the version pull request and npm publish step with GitHub Actions. Add
that only after the package publishing contract and npm authentication strategy are settled; it is a
release decision, not required monorepo plumbing.

The upstream [Changesets introduction](https://github.com/changesets/changesets/blob/main/docs/intro-to-using-changesets.md)
and [configuration reference](https://github.com/changesets/changesets/blob/main/docs/config-file-options.md)
cover the full workflow and every available option.
