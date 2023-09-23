## [5.5.1](https://github.com/willsoto/nestjs-prometheus/compare/v5.5.0...v5.5.1) (2023-09-23)


### Bug Fixes

* **metrics:** mark PROMETHEUS_OPTIONS as optional ([ba6b75b](https://github.com/willsoto/nestjs-prometheus/commit/ba6b75b2d2fa43cb154ff11cd3576f6c68b34001)), closes [#1900](https://github.com/willsoto/nestjs-prometheus/issues/1900)

# [5.5.0](https://github.com/willsoto/nestjs-prometheus/compare/v5.4.0...v5.5.0) (2023-09-15)


### Features

* allow the module to be registered as global ([113c02a](https://github.com/willsoto/nestjs-prometheus/commit/113c02abd155a4b91d7ab9367b3158dcda3604a3))

# [5.4.0](https://github.com/willsoto/nestjs-prometheus/compare/v5.3.0...v5.4.0) (2023-09-10)


### Features

* add prefix to all injected metrics ([2375e42](https://github.com/willsoto/nestjs-prometheus/commit/2375e42c4b40203e9d09917ce6dd91390bb913b8))

# [5.3.0](https://github.com/willsoto/nestjs-prometheus/compare/v5.2.1...v5.3.0) (2023-08-12)


### Features

* support useFactory ([b4608da](https://github.com/willsoto/nestjs-prometheus/commit/b4608da57f70b3ce2ce765caf769de71a6376c18)), closes [#1776](https://github.com/willsoto/nestjs-prometheus/issues/1776)

## [5.2.1](https://github.com/willsoto/nestjs-prometheus/compare/v5.2.0...v5.2.1) (2023-07-14)


### Bug Fixes

* pushgateway injection ([#1810](https://github.com/willsoto/nestjs-prometheus/issues/1810)) ([64cc5ae](https://github.com/willsoto/nestjs-prometheus/commit/64cc5aef8106aceaa4bdf16775cdff25ad404afc)), closes [#1780](https://github.com/willsoto/nestjs-prometheus/issues/1780) [#1809](https://github.com/willsoto/nestjs-prometheus/issues/1809)

# [5.2.0](https://github.com/willsoto/nestjs-prometheus/compare/v5.1.2...v5.2.0) (2023-06-18)


### Features

* remove explicit types from InjectMetric ([2b6f32f](https://github.com/willsoto/nestjs-prometheus/commit/2b6f32fe9b61e0a2002f8c767a32ce4e8f6ca81b)), closes [#1770](https://github.com/willsoto/nestjs-prometheus/issues/1770)

## [5.1.2](https://github.com/willsoto/nestjs-prometheus/compare/v5.1.1...v5.1.2) (2023-05-22)


### Bug Fixes

* add passthrough: true to make custom controllers work again with v5 ([#1739](https://github.com/willsoto/nestjs-prometheus/issues/1739)) ([5e83125](https://github.com/willsoto/nestjs-prometheus/commit/5e83125e30286bb3a61eb10a03d5d311f57c5d57))

## [5.1.1](https://github.com/willsoto/nestjs-prometheus/compare/v5.1.0...v5.1.1) (2023-04-07)


### Bug Fixes

* decorator types ([#1685](https://github.com/willsoto/nestjs-prometheus/issues/1685)) ([6f8a52e](https://github.com/willsoto/nestjs-prometheus/commit/6f8a52eed0efe1e0af1e1c764e32ee67b22e0f67)), closes [#1667](https://github.com/willsoto/nestjs-prometheus/issues/1667)

# [5.1.0](https://github.com/willsoto/nestjs-prometheus/compare/v5.0.0...v5.1.0) (2023-01-08)


### Features

* **pushgateway:** add support for Pushgateway ([f797636](https://github.com/willsoto/nestjs-prometheus/commit/f7976360436d3c02ccafe1590ab7ddc23f633bfe)), closes [#1628](https://github.com/willsoto/nestjs-prometheus/issues/1628)

# [5.0.0](https://github.com/willsoto/nestjs-prometheus/compare/v4.7.0...v5.0.0) (2022-12-19)


### Bug Fixes

* **controller:** removes response.send from route handler ([#1622](https://github.com/willsoto/nestjs-prometheus/issues/1622)) ([bfa6c70](https://github.com/willsoto/nestjs-prometheus/commit/bfa6c7095368bd463e3fdf32f9cc7560c58a682a))


### BREAKING CHANGES

* **controller:** For users that have a custom subclass, you will need to adjust the method to `return super.index(response);` as the base class no longer sends a response.

# [4.7.0](https://github.com/willsoto/nestjs-prometheus/compare/v4.6.0...v4.7.0) (2022-07-10)


### Features

* **nestjs:** support v9 ([5bb4711](https://github.com/willsoto/nestjs-prometheus/commit/5bb4711957b4d347732314ed38e115f429b829f7)), closes [#1475](https://github.com/willsoto/nestjs-prometheus/issues/1475)

# [4.6.0](https://github.com/willsoto/nestjs-prometheus/compare/v4.5.0...v4.6.0) (2022-03-09)


### Features

* ability to set defaultLabels ([7fd289a](https://github.com/willsoto/nestjs-prometheus/commit/7fd289abd35f13a3ddd802e4c519d43210808858)), closes [#1209](https://github.com/willsoto/nestjs-prometheus/issues/1209)
* upgrade packages ([79a67f1](https://github.com/willsoto/nestjs-prometheus/commit/79a67f1508a155c1ee8684d7ea6cd2625265ac9f))

# [4.5.0](https://github.com/willsoto/nestjs-prometheus/compare/v4.4.0...v4.5.0) (2022-02-28)


### Features

* upgrade packages ([662ec6c](https://github.com/willsoto/nestjs-prometheus/commit/662ec6c2245816ab9f7ba69d101f406a815d94c3))

# [4.4.0](https://github.com/willsoto/nestjs-prometheus/compare/v4.3.0...v4.4.0) (2021-11-30)


### Features

* add node-tests reusable workflow ([efd3c89](https://github.com/willsoto/nestjs-prometheus/commit/efd3c89f3ad9b5462b84ecd20c2106d766c083e9))

# [4.3.0](https://github.com/willsoto/nestjs-prometheus/compare/v4.2.0...v4.3.0) (2021-11-28)


### Features

* upgrade packages ([6ab5a68](https://github.com/willsoto/nestjs-prometheus/commit/6ab5a684b73d54c137a0f39f998b7936a03609ac))

# [4.2.0](https://github.com/willsoto/nestjs-prometheus/compare/v4.1.0...v4.2.0) (2021-10-30)


### Features

* **releases:** add changelog to releases ([bc95220](https://github.com/willsoto/nestjs-prometheus/commit/bc9522007058c74a11ce727f48e85ba7202a0e8e))

# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [4.0.0](https://github.com/willsoto/nestjs-prometheus/compare/v2.0.1...v4.0.0) (2021-07-15)


### ⚠ BREAKING CHANGES

* many methods are now async due to upstream changes
* esModuleInterop has been disabled due to #671

### Features

* upgrade to prom-client v13 ([cb04088](https://github.com/willsoto/nestjs-prometheus/commit/cb04088c5780ab2cf851aed19945ddcc8832f2df)), closes [#671](https://github.com/willsoto/nestjs-prometheus/issues/671)

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
