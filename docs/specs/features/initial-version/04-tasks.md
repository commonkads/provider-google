# Tasks — initial-version

All tasks completed on 2026-11-25.

1. **Create `package.json`** — `@commonkads/provider-google`, `@commonkads/engine ^0.1.0` dep, `release` script, `@changesets/cli` devDep, `publishConfig` for GitHub Packages.
2. **Port source files** from `strata/google/src` — replace all `@robproper/strata-engine` imports with `@commonkads/engine`. Files: `src/gemini.ts`, `src/index.ts`.
3. **Create `tsconfig.json`** — NodeNext module resolution, ES2022 target, emits to `dist/`.
4. **Create `tsconfig.test.json`** — extends tsconfig, `noEmit: true`, includes test files.
5. **Create `eslint.config.mjs`** — typescript-eslint + prettier + unused-imports rules.
6. **Create `.github/workflows/ci.yml`** — lint, compile, pack; triggers on PR and `workflow_dispatch`.
7. **Create `.github/workflows/release.yml`** — `changesets/action` publish; triggers on push to main and `workflow_dispatch`.
8. **Create `.changeset/config.json`** — `access: public`, `baseBranch: main`.
9. **Create `.npmrc`** — routes `@commonkads` to GitHub Packages registry.
10. **Create `README.md`** — usage docs for registry and direct construction patterns.
11. **Initialize git repository** with `main` as the default branch.
