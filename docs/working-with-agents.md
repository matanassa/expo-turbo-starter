# Working with coding agents

Good agent instructions are boring on purpose. They tell a coding agent what is true about the repo,
where a change belongs, and how to prove it works. They should not try to predict every task or turn
the project into a prompt library.

This starter keeps that contract in [`AGENTS.md`](../AGENTS.md), following the open
[AGENTS.md convention](https://agents.md/). The file is useful with any coding tool that reads it;
if yours does not, point the tool at it when starting a task.

## What the agent already knows

The included instructions cover the facts that are easy to get subtly wrong:

- the supported Node, pnpm, Expo, and React Native versions
- the app and package boundaries
- thin Expo Router files and app-owned screen behavior
- app-owned Unistyles registration
- the package generator and its two package kinds
- the difference between the normal quality gate and Expo configuration checks
- why Expo Go and legacy Metro monorepo overrides do not belong here

That means a task can focus on the outcome instead of repeating the repository tour every time.

## Prompts that give an agent a fair chance

A useful task names the outcome, the important boundary, and the evidence you expect. It does not
need to prescribe every file or implementation step.

For a package:

```text
Create a React Native workspace package named maps using the repository generator.
Add its first public API test-first. Keep app code out of the package and run pnpm check.
```

For a screen:

```text
Add a Settings screen and link to it from the home screen. Keep Expo Router files routes-only,
put the screen body under src/screens, and add a colocated behavior test. Run pnpm check.
```

For an Expo dependency change:

```text
Check which version of this dependency Expo SDK 57 expects before changing it. Update the lockfile,
then run pnpm check, pnpm expo:doctor, and pnpm export:web. Explain any native rebuild requirement.
```

For investigation without an accidental rewrite:

```text
Trace why this test fails and report the root cause with file references. Do not change files yet.
```

The last sentence matters. Be explicit when you want diagnosis only, a plan first, or a completed
implementation.

## A healthy working loop

1. Ask for one bounded outcome.
2. Let the agent inspect the relevant code and existing tests before proposing a new pattern.
3. Review the diff, especially dependency additions, native configuration, and package boundaries.
4. Require the smallest relevant test while iterating and the repository quality gate before
   finishing.
5. Ask for a concise handoff: what changed, what ran, and what remains uncertain.

Green checks are necessary, not magical. Read security-sensitive code, migrations, release
configuration, and native changes with the same care you would give a human-authored pull request.

## Customize the instructions with the product

After running `pnpm run setup`, update `AGENTS.md` when the project gains a stable decision that an
agent should not rediscover on every task. Good additions include:

- the chosen data-fetching and state-management boundaries
- authentication and session ownership
- environment naming and which configuration is safe to commit
- analytics naming rules
- whether native directories are generated or committed
- release, changeset, and deployment requirements
- commands for backend, end-to-end, or visual tests you add later

Write rules only after the decision is real. “Use the existing query client in `src/data`” is useful;
“prefer modern best practices” is not.

Add a nested `AGENTS.md` only when a subtree has genuinely different commands or constraints. For
example, a future backend service might need its own database and migration rules. Three shared
packages following the same root contract do not need three copied files.

## Keep private context out of the repository

Do not put secrets, customer data, credentials, private URLs, or personal machine paths in agent
instructions. Repository files are shared context. Use ignored local instruction files or your
tool's user-level configuration for personal preferences that should not ship with the template.

Temporary task details also belong in an issue or prompt, not `AGENTS.md`. If an instruction stops
being true, change or remove it in the same pull request that changes the architecture.

## Tool-specific instruction files

Start with the single root `AGENTS.md`. If a tool in your actual workflow requires a dedicated file,
add a thin adapter and keep the repository rules canonical. Avoid pasting the full instructions into
`CLAUDE.md`, Cursor rules, Copilot instructions, and other files; duplicated rules drift and leave
agents with conflicting answers.

Verify the adapter with the tool before committing it. A file that merely looks compatible but is
never loaded is worse than no adapter because maintainers will trust context the agent never saw.
