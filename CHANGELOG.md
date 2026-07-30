# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

Versions prior to `2.0.0` predate this changelog — see the
[full commit history](https://github.com/Om-jannu/create-fs-app/commits/master) for that era.

## [Unreleased]

## [2.0.5] - 2026-07-30

### Changed
- Publishing to npm now happens only when a version tag (`v*`) is pushed, instead of on every push to `master`.
- Switched npm publishing from a long-lived `NPM_TOKEN` secret to [npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers) (OIDC) — no stored token, no OTP prompts in CI.
- `create-fs-app` no longer installs dependencies by default after scaffolding; pass `--install` to opt in (previously `--no-install` was needed to opt out).
- CI workflows updated to current major versions of `actions/checkout` and `actions/setup-node`, and the archived `actions/create-release` action was replaced with the `gh` CLI.

> **Note:** `v2.0.4` was tagged but never published to npm due to a CI authentication issue; its changes are included in this release.

## [2.0.3] - 2026-05-29

### Fixed
- Corrected the `homepage` URL in `package.json` to point to the live site.

## [2.0.2] - 2026-05-29

### Changed
- Internal release housekeeping; no user-facing changes.

## [2.0.1] - 2026-05-29

### Added
- Contributor metadata and stable UUIDs for templates in the registry.
- Remote registry fetching with local caching, so new templates are picked up without a CLI release.
- Expanded project configuration options for improved scaffolding.

### Changed
- Health check now verifies environment tools and reports clearer output.
- Template customization improved for pnpm support.
- `--version` now reads from `package.json` instead of a hardcoded value.
- Scoped `@my-app/` package names are rewritten to the project name at scaffold time.
- README reorganized with a cleaner layout and updated assets; docs consolidated.

### Fixed
- Template registry URL corrected to point at the `create-fs-app-templates` repo.

### Removed
- Dropped the standalone package-size analysis script.

## [2.0.0] - 2026-02-14

### Added
- Initial `2.x` release: rebuilt template registry, scaffolding pipeline, and website scaffolding.

[Unreleased]: https://github.com/Om-jannu/create-fs-app/compare/v2.0.5...HEAD
[2.0.5]: https://github.com/Om-jannu/create-fs-app/compare/v2.0.3...v2.0.5
[2.0.3]: https://github.com/Om-jannu/create-fs-app/compare/v2.0.2...v2.0.3
[2.0.2]: https://github.com/Om-jannu/create-fs-app/compare/v2.0.1...v2.0.2
[2.0.1]: https://github.com/Om-jannu/create-fs-app/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/Om-jannu/create-fs-app/releases/tag/v2.0.0
