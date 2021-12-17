# Changelog Config

The `changelog config` command generates a new changelog configuration file.

## Default file

```json
{
  // Idenfier of repository for issues and pull requests
  "repository": "joachimdalen/azext",
  // Main title format
  "changelogTitle": { "size": "h1", "format": "Changelog" },
  // Format of title for main release - Example:  ## 0.0.1 (2020-10-01)
  "releaseTitleFormat": {
    "size": "h2",
    "format": "{{version}} ({{publishDate}})"
  },
  // Format of title for extension part (e.g task) - Example: #### `BuildTaskOne@2.1.45`
  "moduleTitleFormat": { "size": "h4", "format": "`{{name}}@{{version}}`" },
  "sectionSplitter": "---",
  // Header size of tags/area names
  "tagSize": "h3",
  // This maps to the type field and provides headers for specific types
  "tagMapping": {
    "feature": ":rocket: Features",
    "fix": ":bug: Fixes",
    "tests": ":test_tube: Tests",
    "other": ":speech_balloon: Other",
    "docs": ":memo: Documentation",
    "maint": ":hammer_and_wrench: Maintenance"
  },
  // Format of title for attributions
  "attributionTitleFormat": { "size": "h2", "format": ":star2: Contributors" },
  // Format of sub-title for attributions
  "attributionSubTitle": {
    "format": "Thank you to the following for contributing to the latest release"
  },
  // This is the known authors that should not have their contributions listed in the changelog
  "knownAuthors": [],
  // Use issue title instead of number in links
  "useDescriptiveIssues": true,
  // Replace emoji codes with emojis for the following items
  "replaceEmojis": {
    "tags": true,
    "changelogTitle": true,
    "releaseTitle": true,
    "moduleTitle": true,
    "attributionTitle": true,
    "attributionSubTitle": true,
    "githubIssues": false,
    "githubPullRequests": false,
    "notes": true,
    "summary": true
  }
}
```

## Help

```text
> azext changelog config help
```

[//]: # "#help-definition[command=changelog,config,help]"

```text

Config

  Generate default config file

Command List

  help   Print this usage guide.

Options

  --force    Overwrite file if it exists

Global Options

  --ci string   Run in CI mode. Currenctly supported: ado (Azure DevOps) --ci=ado

```

[//]: # "#help-definition[end]"

## Formatted title

The configuration uses a title format consisting of two properties:

```json
{ "size": "h2", "format": "Text" }
```

- `size`: One of `h1`, `h2`, `h3`, `h4` and defines the size of the text
- `format`: Text with format variables

## Example

**Raw**

```json
{
  "publishDate": "2021-12-12",
  "version": "0.0.2",
  "modules": [
    {
      "name": "my-module",
      "version": "0.1.2",
      "changes": [
        {
          "type": "feature",
          "description": "Added this"
        }
      ]
    }
  ]
}
```

**Generated content**

```md
# Changelog

## 0.0.2 (2021-12-12)

### 🚀 Features

#### `my-module@0.1.2`

- Added this

---
```

## Repository

The repository field identifies the repository that the changelog is generated for. We use this to know where to fetch issues and pull requests from. Should be of the format `username/repository`

## Changelog Title

This is the main title for the changelog file.

### Supported Variables

| Variable | Description |
| -------- | ----------- |
|          |             |

## Release Title

The release title is the title for the individual release

### Supported Variables

| Variable      | Description                                        |
| ------------- | -------------------------------------------------- |
| `version`     | The version of the individual release. E.g `0.0.2` |
| `publishDate` | The date of the release. E.g `2021-12-12`          |

## Module Title

This is the title for the individual modules/sections

### Supported Variables

| Variable  | Description                             |
| --------- | --------------------------------------- |
| `name`    | The name of the module. E.g `my-module` |
| `version` | The version of the module. E.g `0.1.2`  |
