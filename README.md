# Azure DevOps Extension Changelog Generator


## Options
```sh
--output, -o
    Output markdown file path
    Default: CHANGELOG.md
--generate-cache:
    Default: false
--cache-file
    Default: changelog-cache.json
--config-file
    Default: changelog-config.json
--no-format
    Do not format the markdown file before writing it
    Default: false
```

## Configuration

```json
{
  // Idenfier of repository for issues and pull requests
  "repository": "joachimdalen/AzureDevOpsExtensions", 
  // Format of title for main release - Example:  ## 0.0.1 (2020-10-01)
  "releaseTitleFormat": "## {{version}} ({{publishDate}})", 
  // Format of title for extension part (e.g task) - Example: #### `BuildTaskOne@2.1.45`
  "moduleTitleFormat": "#### `{{name}}@{{version}}`", 
  "taskMapping": {},
  "sectionSplitter": "---",
  // This maps to the type field and provides headers for specific types
  "tagMapping": {
    "feature": "### 🚀 Features",
    "fix": "### 🐛 Fixes",
    "tests": "### 🧪 Tests",
    "other": "### 💬 Other",
    "docs": "### Documentation"
  }, 
  "attributionTitleFormat": "## 🌟 Contributors",
  "attributionSubTitle": "Thank you to the following for contributing to the latest release",
  // This is the known authors that should not have their contributions listed in the changelog
  "knownAuthors": ["joachimdalen"],
  // Use issue title instead of number in links
  "useDescriptiveIssues": true 
}
```