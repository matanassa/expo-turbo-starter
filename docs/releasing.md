# Production Releases

The starter ships production-safe release plumbing without linking itself to an Expo account or app
store. The EAS workflows are manual until a generated application is configured, so creating a repo
from this template cannot accidentally spend build minutes or publish an update.

## Link the generated app

Run `pnpm run setup` first and commit `.template-initialized.json`. Then, from
`apps/mobile-app`, link the app to an EAS project using the pinned major accepted by `eas.json`:

```sh
pnpm dlx eas-cli@21.0.2 init
```

Keep `EAS_PROJECT_ID` in local and EAS environment configuration. The project ID is not secret, but
using the same variable locally and remotely prevents the resolved config from drifting. Configure
the following values in the `development`, `preview`, and `production` EAS environments:

- `APP_NAME`
- `APP_SLUG`
- `APP_SCHEME`
- `IOS_BUNDLE_IDENTIFIER`
- `ANDROID_PACKAGE`
- `EAS_PROJECT_ID`

The build profiles set `APP_ENV`. Production config intentionally fails when it sees placeholder
native identifiers or a missing project ID.

Initialize signing credentials with one deliberate build per platform before relying on automation.
App stores may also require the first Android submission to be uploaded manually.

## Validate a release candidate

The native smoke workflow builds installable Android and iOS artifacts, then runs the same stable
Maestro flow on both:

```sh
cd apps/mobile-app
pnpm dlx eas-cli@21.0.2 workflow:run .eas/workflows/e2e.yml
```

For a local installed build, run:

```sh
MAESTRO_APP_ID=com.example.yourapp maestro test .maestro/smoke.yml
```

Keep the default smoke flow fast and unauthenticated. Product-specific journeys belong in additional
flows with their own test-data strategy.

## Deliver production

Update the user-facing `version` in `app.config.ts`, merge only after GitHub CI and smoke validation
pass, then dispatch:

```sh
cd apps/mobile-app
pnpm dlx eas-cli@21.0.2 workflow:run .eas/workflows/production.yml
```

The workflow calculates each platform's native fingerprint and pauses for approval. If no compatible
binary exists, it builds and submits one. If a compatible binary exists, it publishes an OTA update
to the production branch. Build numbers remain EAS-managed through `appVersionSource: remote` and
`autoIncrement`.

Never add dates, commit hashes, or other volatile values to fingerprinted native configuration. A
fingerprint must describe compatibility, not a particular CI attempt.

For a bad OTA, republish the last known-good update. For a bad binary, create and submit a new binary;
store releases cannot be rolled back by an OTA.
