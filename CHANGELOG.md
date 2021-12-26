# Changelog

## 0.2.3 (2021-12-XX)

### 🛠️ Maintenance (1)

#### `core@0.2.3`

- Use standalone prettier to reduce size
  - Pull Request: [GH#31 - Use standalone prettier](https://github.com/joachimdalen/azext/pull/31)

### 🐛 Fixes (1)

#### `readme@0.2.3`

- Fixed wrong fields being used when generating yaml examples
  - Issue: [GH#29 - Wrong usage example is generated](https://github.com/joachimdalen/azext/issues/29)
  - Pull Request: [GH#32 - Fix wrong fields used in usage docs](https://github.com/joachimdalen/azext/pull/32)

---

## 0.2.2 (2021-12-26)

### 🐛 Fixes (3)

#### `changelog@0.2.2`

- Fix GitHub pull requests getting the wrong link title
  - Issue: [GH#22 - Changes with only a linked pull request gets the wrong link type](https://github.com/joachimdalen/azext/issues/22)
  - Pull Request: [GH#23 - Fix PRs getting wrong title](https://github.com/joachimdalen/azext/pull/23)
- Fix certain cli options not passing the correct value to handler
  - Issue: [GH#24 - Changelog has mismatch between options and names](https://github.com/joachimdalen/azext/issues/24)
  - Pull Request: [GH#25 - Fix wrong option names being passed from cli to handler](https://github.com/joachimdalen/azext/pull/25)

#### `init@0.2.2`

- Fixed an issue where the cli would look for `.azext` directory when trying to create it
  - Issue: [GH#21 - Can not initialize in a new project](https://github.com/joachimdalen/azext/issues/21)
  - Pull Request: [GH#26 - Fix not being able to initialize in a new project](https://github.com/joachimdalen/azext/pull/26)

### 💬 Other (2)

#### `readme@0.2.2`

- Refactor how cli parameters are set in the cli definition
  - Pull Request: [GH#25 - Fix wrong option names being passed from cli to handler](https://github.com/joachimdalen/azext/pull/25)

#### `init@0.2.2`

- Refactor how cli parameters are set in the cli definition
  - Pull Request: [GH#25 - Fix wrong option names being passed from cli to handler](https://github.com/joachimdalen/azext/pull/25)

---

## 0.2.1 (2021-12-25)

### 📝 Documentation (1)

#### `core@0.2.1`

- Updated NPM readme
  - Pull Request: [GH#20 - Fix readme for Npm](https://github.com/joachimdalen/azext/pull/20)

---

## 0.2.0 (2021-12-22)

> This release introduces a new command (`azext readme`) to manage documentation. See [GitHub Documentation](https://github.com/joachimdalen/azext/blob/master/docs/readme/index.md) for more information.

### 🛠️ Maintenance (2)

#### `core@0.2.0`

- Split CLI and implementation in preparation for Node API
  - Pull Request: [GH#6 - Refactor to support for usage from node](https://github.com/joachimdalen/azext/pull/6)
- Forced path of configuration files to be in folder `.azext/`
  - Pull Request: [GH#12 - Refactoring and docs generation](https://github.com/joachimdalen/azext/pull/12)

### 🐛 Fixes (2)

#### `changelog@0.2.0`

- Fixed an issue with escaping characters for issue and pull request titles
  - Pull Request: [GH#6 - Refactor to support for usage from node](https://github.com/joachimdalen/azext/pull/6)

#### `init@0.2.0`

- Fixed init command not respecting `--root` option
  - Issue: [GH#2 - Init command does not respect --root option](https://github.com/joachimdalen/azext/issues/2)
  - Pull Request: [GH#6 - Refactor to support for usage from node](https://github.com/joachimdalen/azext/pull/6)

### 📝 Documentation (1)

#### `core@0.2.0`

- Added more detailed documentation
  - Pull Request: [GH#7 - Update documentation](https://github.com/joachimdalen/azext/pull/7)

### 🚀 Features (9)

#### `readme@0.1.0`

- Introduced feature
  - Issue: [GH#3 - Documentation generation](https://github.com/joachimdalen/azext/issues/3)
  - Pull Request: [GH#12 - Refactoring and docs generation](https://github.com/joachimdalen/azext/pull/12)

#### `changelog@0.2.0`

- Include issue number and pull request number when using descriptive titles
  - Pull Request: [GH#6 - Refactor to support for usage from node](https://github.com/joachimdalen/azext/pull/6)
- Added help command for changelog generation
  - Pull Request: [GH#7 - Update documentation](https://github.com/joachimdalen/azext/pull/7)
- Updated title for linked issues and pull requests
  - Pull Request: [GH#12 - Refactoring and docs generation](https://github.com/joachimdalen/azext/pull/12)
- Renamed `tagSize` to `typeSize` and `tagMapping` to `typeMapping` in configuration
- Added `changeCount` variable to type headers
  - Issue: [GH#9 - Add change count to tag headers](https://github.com/joachimdalen/azext/issues/9)
  - Pull Request: [GH#15 - Add changeCount to type titles](https://github.com/joachimdalen/azext/pull/15)
- Added new subcommand ([cache](https://github.com/joachimdalen/azext/blob/master/docs/changelog/cache.md)) to update metadata cache
  - Issue: [GH#13 - Add command to populate changelog cache without generating it](https://github.com/joachimdalen/azext/issues/13)
  - Pull Request: [GH#16 - Add command for refresh of changelog cache](https://github.com/joachimdalen/azext/pull/16)

#### `core@0.2.0`

- Add support for global options
  - Pull Request: [GH#7 - Update documentation](https://github.com/joachimdalen/azext/pull/7)

#### `init@0.2.0`

- Add new command to create mapping file
  - Issue: [GH#3 - Documentation generation](https://github.com/joachimdalen/azext/issues/3)

---

## 0.0.1 (2021-12-13)

Initial release of AzExt

### 🛠️ Maintenance (1)

#### `core@0.0.1`

- Setup CI and CD
  - Pull Request: [GH#1 - Setup build and deployment pipeline](https://github.com/joachimdalen/azext/pull/1)

### 🚀 Features (3)

#### `changelog@0.0.1`

- Added changelog command

#### `init@0.0.1`

- Added init command

#### `config@0.0.1`

- Added config command

---
