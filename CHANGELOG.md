# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [3.0.0](https://github.com/willsoto/nestjs-prometheus/compare/v2.0.1...v3.0.0) (2020-12-23)


### ⚠ BREAKING CHANGES

* many methods are now async due to upstream changes
* esModuleInterop has been disabled due to #671

### Features

* upgrade to prom-client v13 ([cb04088](https://github.com/willsoto/nestjs-prometheus/commit/cb04088c5780ab2cf851aed19945ddcc8832f2df)), closes [#671](https://github.com/willsoto/nestjs-prometheus/issues/671)

### [2.0.1](https://github.com/willsoto/nestjs-prometheus/compare/v2.0.0...v2.0.1) (2020-11-07)


### Bug Fixes

* **controller:** don't include Express types ([e4a022c](https://github.com/willsoto/nestjs-prometheus/commit/e4a022cde8e0e9aae84ec2be098442217f9f8849)), closes [#530](https://github.com/willsoto/nestjs-prometheus/issues/530)

## [2.0.0](https://github.com/willsoto/nestjs-prometheus/compare/v1.1.0...v2.0.0) (2020-10-09)


### ⚠ BREAKING CHANGES

* shouldn't affect anybody, but if people relied on there being an ESM version
it is gone now

Signed-off-by: Will Soto <willsoto@users.noreply.github.com>

### Bug Fixes

* remove esm version ([a6c7545](https://github.com/willsoto/nestjs-prometheus/commit/a6c7545df30cac94c7fea2ff434093cf929ff57b))

## [1.1.0](https://github.com/willsoto/nestjs-prometheus/compare/v1.0.0...v1.1.0) (2020-10-09)


### Features

* add support for custom controllers ([92b1f8a](https://github.com/willsoto/nestjs-prometheus/commit/92b1f8a087332978ad09bbd624a9953fa9056ad0)), closes [#507](https://github.com/willsoto/nestjs-prometheus/issues/507)

## [1.0.0](https://github.com/willsoto/nestjs-prometheus/compare/v0.1.3...v1.0.0) (2020-10-06)

### [0.1.3](https://github.com/willsoto/nestjs-prometheus/compare/v0.1.2...v0.1.3) (2020-08-25)


### Features

* add support for fastify ([0ff55d9](https://github.com/willsoto/nestjs-prometheus/commit/0ff55d9d1b8e06e98d31027c7b2d30521976bcc9))

### [0.1.2](https://github.com/willsoto/nestjs-prometheus/compare/v0.1.1...v0.1.2) (2020-08-13)

### [0.1.1](https://github.com/willsoto/nestjs-prometheus/compare/v0.1.0...v0.1.1) (2020-03-07)

## [0.1.0](https://github.com/willsoto/nestjs-prometheus/compare/v0.0.7...v0.1.0) (2020-02-22)


### ⚠ BREAKING CHANGES

* prom-client breaking changes
include changes to types, so this is a major version to be safe.
See https://github.com/siimon/prom-client/releases/tag/v12.0.0

Signed-off-by: Will Soto <willsoto@users.noreply.github.com>

### Features

* upgrade prom-client to v12 ([75709d3](https://github.com/willsoto/nestjs-prometheus/commit/75709d3f634af0e4ae869ba548e5213316bedf39))

### [0.0.7](https://github.com/willsoto/nestjs-prometheus/compare/v0.0.6...v0.0.7) (2020-01-13)

### [0.0.6](https://github.com/willsoto/nestjs-prometheus/compare/v0.0.5...v0.0.6) (2019-11-27)


### Bug Fixes

* **workflows/publish:** publish is not a script ([be01dfb](https://github.com/willsoto/nestjs-prometheus/commit/be01dfbcf2cbb29d982a045f75611cd5a19be21b))

### [0.0.5](https://github.com/willsoto/nestjs-prometheus/compare/v0.0.4...v0.0.5) (2019-11-27)


### Bug Fixes

* **workflows/publish:** remove login step ([7c27bc9](https://github.com/willsoto/nestjs-prometheus/commit/7c27bc99975ef38e8de1f2090d6f04ff41cea725))

### [0.0.4](https://github.com/willsoto/nestjs-prometheus/compare/v0.0.3...v0.0.4) (2019-11-27)

### Bug Fixes

- **workflows/publish:** remove scope ([9eb3295](https://github.com/willsoto/nestjs-prometheus/commit/9eb32958101bd2e530999c41ab2a28e86672cfd6))

### [0.0.3](https://github.com/willsoto/nestjs-prometheus/compare/v0.0.2...v0.0.3) (2019-11-27)

### Bug Fixes

- **workflows:** interpolate github.ref ([a85aede](https://github.com/willsoto/nestjs-prometheus/commit/a85aede98e7900ddf7dcfc0d8daf65e1a435bd8d))
- **workflows/publish:** login to the correct scope ([9854da3](https://github.com/willsoto/nestjs-prometheus/commit/9854da37c6556d12c93010c0ba77bec9773b3271))

### [0.0.2](https://github.com/willsoto/nestjs-prometheus/compare/v0.0.1...v0.0.2) (2019-11-26)

### 0.0.1 (2019-11-26)

### Features

- add publish workflow ([ba6cba2](https://github.com/willsoto/nestjs-prometheus/commit/ba6cba29d7ef9c1937a27fde3611e843ac4884cc))
- **all:** initial commit ([a895bfd](https://github.com/willsoto/nestjs-prometheus/commit/a895bfda96bfd8de3dd021ad1c06116bea76648e))
- **module:** add support for registerAsync ([036d776](https://github.com/willsoto/nestjs-prometheus/commit/036d776603b78ad1a9d60a32a040d9957bbb4cc3))

### Bug Fixes

- **docs:** switch to using deploy keys ([8c0b22c](https://github.com/willsoto/nestjs-prometheus/commit/8c0b22c55a3f3aff9cfc5cd0a2080da49a34a53d))
