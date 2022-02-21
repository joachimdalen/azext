# Changelog

## 0.7.0 (2022-02-21)

**🔥 BREAKING CHANGES 🔥**

- Format for task input generation has changed
- Removed `includeInputFields` and `requiredOptions` from README config

---

### 🚀 Features (1)

#### `readme@0.7.0`

- New layout for task input
  - Suggested in [GH#48 - Rewrite task input command to produce better output](https://github.com/joachimdalen/azext/pull/48)

---

## 0.6.0 (2022-02-19)

### 🛠️ Maintenance (1)

- Update dependencies
  - Issue: [GH#47 - Update dependencies](https://github.com/joachimdalen/azext/pull/47)

## 📦 Module changes

### 🚀 Features (2)

#### `readme@0.6.0`

- Process replacement commands in partial files

  - Suggested in [GH#30 - Process replacement commands in partial files](https://github.com/joachimdalen/azext/issues/30)
  - Added in [PR#45 - Process replacement commands in partial files](https://github.com/joachimdalen/azext/pull/45)

- Added asset handling for images to support multiple documentation displays
  - Suggested in [GH#3 - Documentation generation](https://github.com/joachimdalen/azext/issues/3)
  - Added in [PR#46 - Add asset handling and fix minor changelog issue](https://github.com/joachimdalen/azext/pull/46)

### 🐛 Fixes (1)

#### `changelog@0.6.0`

- Fixed extra splitting line added for the first version
  - Fixed in [PR#46 - Add asset handling and fix minor changelog issue](https://github.com/joachimdalen/azext/pull/46)

---

## 0.5.0 (2022-01-16)

**🔥 BREAKING CHANGES 🔥**

- Removed `notes` and `summary` from `changelog`. These have been replaced by `sections`

---

### 🚀 Features (2)

#### `changelog@0.5.0`

- Added the ability to define custom sections

  - Suggested in [GH#40 - Add ability to set a "Known issues" section on root](https://github.com/joachimdalen/azext/issues/40)
  - Added in [PR#42 - Add ability to define custom information sections at root level](https://github.com/joachimdalen/azext/pull/42)

- Added the ability to add multiple issues and pull requests per change
  - Added in [PR#43 - Add ability to add multiple issues and prs](https://github.com/joachimdalen/azext/pull/43)

---

## 0.4.0 (2022-01-05)

### 🚀 Features (1)

#### `changelog@0.4.0`

- Added the ability to override issue and title prefixed with [typeResourcePrefixMapping](https://github.com/joachimdalen/azext/blob/master/docs/changelog/config.md#type-resource-prefix-mapping)
  - Added in [PR#38 - Add ability to override issue and pr prefix](https://github.com/joachimdalen/azext/pull/38)

### 📣 Enhancements (2)

#### `changelog@0.4.0`

- Merge default config with user config
  - Suggested in [GH#37 - Merge user config with default to ensure all config is set](https://github.com/joachimdalen/azext/issues/37)
  - Improved in [PR#39 - Merge configs to ensure defaults are provided](https://github.com/joachimdalen/azext/pull/39)

#### `readme@0.4.0`

- Merge default config with user config
  - Suggested in [GH#37 - Merge user config with default to ensure all config is set](https://github.com/joachimdalen/azext/issues/37)
  - Improved in [PR#39 - Merge configs to ensure defaults are provided](https://github.com/joachimdalen/azext/pull/39)

---

## 0.3.0 (2021-12-30)

### 💬 Other (1)

- Use standalone prettier to reduce size
  - Pull Request: [PR#31 - Use standalone prettier](https://github.com/joachimdalen/azext/pull/31)

## 📦 Module changes

### 🚀 Features (2)

#### `changelog@0.3.0`

- Added ability to add changes outside of individual modules

  - Suggested in [GH#10 - Add changes to root release outside of individual modules](https://github.com/joachimdalen/azext/issues/10)
  - Added in [PR#34 - Add changes to root release](https://github.com/joachimdalen/azext/pull/34)

- Added config to set format for contributor link
  - Added in [PR#35 - Fix duplicated authors in contributions](https://github.com/joachimdalen/azext/pull/35)

### 🐛 Fixes (2)

#### `changelog@0.3.0`

- Fixed duplicated contributors in list
  - Reported in [GH#33 - Duplicated contributors](https://github.com/joachimdalen/azext/issues/33)
  - Fixed in [PR#35 - Fix duplicated authors in contributions](https://github.com/joachimdalen/azext/pull/35)

#### `readme@0.3.0`

- Fixed wrong fields being used when generating yaml examples
  - Reported in [GH#29 - Wrong usage example is generated](https://github.com/joachimdalen/azext/issues/29)
  - Fixed in [PR#32 - Fix wrong fields used in usage docs](https://github.com/joachimdalen/azext/pull/32)

---

## 0.2.2 (2021-12-26)

### 🐛 Fixes (3)

#### `changelog@0.2.2`

- Fix GitHub pull requests getting the wrong link title

  - Reported in [GH#22 - Changes with only a linked pull request gets the wrong link type](https://github.com/joachimdalen/azext/issues/22)
  - Fixed in [PR#23 - Fix PRs getting wrong title](https://github.com/joachimdalen/azext/pull/23)

- Fix certain cli options not passing the correct value to handler
  - Reported in [GH#24 - Changelog has mismatch between options and names](https://github.com/joachimdalen/azext/issues/24)
  - Fixed in [PR#25 - Fix wrong option names being passed from cli to handler](https://github.com/joachimdalen/azext/pull/25)

#### `init@0.2.2`

- Fixed an issue where the cli would look for `.azext` directory when trying to create it
  - Reported in [GH#21 - Can not initialize in a new project](https://github.com/joachimdalen/azext/issues/21)
  - Fixed in [PR#26 - Fix not being able to initialize in a new project](https://github.com/joachimdalen/azext/pull/26)

### 💬 Other (2)

#### `readme@0.2.2`

- Refactor how cli parameters are set in the cli definition
  - Pull Request: [PR#25 - Fix wrong option names being passed from cli to handler](https://github.com/joachimdalen/azext/pull/25)

#### `init@0.2.2`

- Refactor how cli parameters are set in the cli definition
  - Pull Request: [PR#25 - Fix wrong option names being passed from cli to handler](https://github.com/joachimdalen/azext/pull/25)

---

## 0.2.1 (2021-12-25)

### 📝 Documentation (1)

- Updated NPM readme
  - Changed in [PR#20 - Fix readme for Npm](https://github.com/joachimdalen/azext/pull/20)

---

## 0.2.0 (2021-12-22)

**✏️ Release summary**

This release introduces a new command (`azext readme`) to manage documentation. See [GitHub Documentation](https://github.com/joachimdalen/azext/blob/master/docs/readme/index.md) for more information.

---

### 🚀 Features (1)

- Add support for global options
  - Added in [PR#7 - Update documentation](https://github.com/joachimdalen/azext/pull/7)

### 🛠️ Maintenance (2)

- Split CLI and implementation in preparation for Node API

  - Pull Request: [PR#6 - Refactor to support for usage from node](https://github.com/joachimdalen/azext/pull/6)

- Forced path of configuration files to be in folder `.azext/`
  - Pull Request: [PR#12 - Refactoring and docs generation](https://github.com/joachimdalen/azext/pull/12)

### 📝 Documentation (1)

- Added more detailed documentation
  - Changed in [PR#7 - Update documentation](https://github.com/joachimdalen/azext/pull/7)

## 📦 Module changes

### 🚀 Features (8)

#### `readme@0.1.0`

- Introduced feature
  - Suggested in [GH#3 - Documentation generation](https://github.com/joachimdalen/azext/issues/3)
  - Added in [PR#12 - Refactoring and docs generation](https://github.com/joachimdalen/azext/pull/12)

#### `changelog@0.2.0`

- Include issue number and pull request number when using descriptive titles

  - Added in [PR#6 - Refactor to support for usage from node](https://github.com/joachimdalen/azext/pull/6)

- Added help command for changelog generation

  - Added in [PR#7 - Update documentation](https://github.com/joachimdalen/azext/pull/7)

- Updated title for linked issues and pull requests

  - Added in [PR#12 - Refactoring and docs generation](https://github.com/joachimdalen/azext/pull/12)

- Renamed `tagSize` to `typeSize` and `tagMapping` to `typeMapping` in configuration

- Added `changeCount` variable to type headers

  - Suggested in [GH#9 - Add change count to tag headers](https://github.com/joachimdalen/azext/issues/9)
  - Added in [PR#15 - Add changeCount to type titles](https://github.com/joachimdalen/azext/pull/15)

- Added new subcommand ([cache](https://github.com/joachimdalen/azext/blob/master/docs/changelog/cache.md)) to update metadata cache
  - Suggested in [GH#13 - Add command to populate changelog cache without generating it](https://github.com/joachimdalen/azext/issues/13)
  - Added in [PR#16 - Add command for refresh of changelog cache](https://github.com/joachimdalen/azext/pull/16)

#### `init@0.2.0`

- Add new command to create mapping file
  - Suggested in [GH#3 - Documentation generation](https://github.com/joachimdalen/azext/issues/3)

### 🐛 Fixes (2)

#### `changelog@0.2.0`

- Fixed an issue with escaping characters for issue and pull request titles
  - Fixed in [PR#6 - Refactor to support for usage from node](https://github.com/joachimdalen/azext/pull/6)

#### `init@0.2.0`

- Fixed init command not respecting `--root` option
  - Reported in [GH#2 - Init command does not respect --root option](https://github.com/joachimdalen/azext/issues/2)
  - Fixed in [PR#6 - Refactor to support for usage from node](https://github.com/joachimdalen/azext/pull/6)

---

## 0.0.1 (2021-12-13)

**✏️ Release summary**

Initial release of AzExt

---

### 🛠️ Maintenance (1)

- Setup CI and CD
  - Pull Request: [PR#1 - Setup build and deployment pipeline](https://github.com/joachimdalen/azext/pull/1)

## 📦 Module changes

### 🚀 Features (3)

#### `changelog@0.0.1`

- Added changelog command

#### `init@0.0.1`

- Added init command

#### `config@0.0.1`

- Added config command

---
