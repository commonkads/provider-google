# Requirements — initial-version

## In scope

- Standalone git repository and npm package published to GitHub Packages under `@commonkads`
- Package name: `@commonkads/provider-google`
- Source code ported from `strata/google/src` with all `@robproper/strata-engine` imports replaced by `@commonkads/engine`
- `@commonkads/engine ^0.1.0` as the production dependency
- CI workflow: lint + compile + pack; triggers on PR to `main` and `workflow_dispatch`
- Release workflow: `changesets/action`; triggers on push to `main` and `workflow_dispatch`
- `.changeset/config.json` and `.npmrc` pointing `@commonkads` at GitHub Packages registry
- `README.md` with usage documentation

## Out of scope

- Changes to provider logic or behavior
- Monorepo integration or workspace references
- New features beyond what `strata/google` provided
