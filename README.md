<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/joachimdalen/azext">
    <img src="docs/images/azext-icon.png" alt="Logo" width="100" height="100">
  </a>

<h3 align="center">AzExt - Azure DevOps Extension Tools</h3>

  <p align="center">
    A collection of tools to help with developing extensions for Azure DevOps.
    <br />
    <a href="https://github.com/joachimdalen/azext"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://www.npmjs.com/package/@joachimdalen/azext">View Package</a>
    ·
    <a href="https://github.com/joachimdalen/azext/blob/master/docs/CHANGELOG.md">Changelog</a>
    ·
    <a href="https://github.com/joachimdalen/azext/issues">Report Bug</a>
    ·
    <a href="https://github.com/joachimdalen/azext/issues">Request Feature</a>
  </p>
</div>

<div align="center">
  <img alt="Azure DevOps builds" src="https://img.shields.io/azure-devops/build/dalenapps/6531387f-baea-443c-a284-0d0e786e56c3/39?color=0078d7&label=Master%20Build&logo=azure-devops&style=flat-square">
</div>
<div align="center">
<img alt="Issues" src="https://img.shields.io/github/issues/joachimdalen/azext.svg?style=flat-square">
  <img alt="License" src="https://img.shields.io/github/license/joachimdalen/azext?style=flat-square">
  <img alt="npm bundle size (scoped)" src="https://img.shields.io/bundlephobia/min/@joachimdalen/azext?style=flat-square">
  <img alt="npm (scoped)" src="https://img.shields.io/npm/v/@joachimdalen/azext?logo=npm&style=flat-square">
</div>

<div align="center">
  <img alt="Dependent repos (via libraries.io), scoped npm package" src="https://img.shields.io/librariesio/dependent-repos/npm/@joachimdalen/azext?style=flat-square">
  <img alt="Libraries.io dependency status for latest release, scoped npm package" src="https://img.shields.io/librariesio/release/npm/@joachimdalen/azext?style=flat-square">
  <img alt="Snyk Vulnerabilities for npm scoped package" src="https://img.shields.io/snyk/vulnerabilities/npm/@joachimdalen/azext?style=flat-square">
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#limitations">Limitations</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

AzExt provides a set of utilities to help with developing Extensions for Azure DevOps.

## Configuration

```json
{
  // Idenfier of repository for issues and pull requests
  "repository": "joachimdalen/azext",
  "changelogTitle": { "size": "h1", "format": "Changelog" },
  "releaseTitleFormat": {
    "size": "h2",
    "format": "{{version}} ({{publishDate}})"
  },
  "moduleTitleFormat": { "size": "h4", "format": "`{{name}}@{{version}}`" },
  "taskMapping": {},
  "sectionSplitter": "---",
  "tagSize": "h3",
  "tagMapping": {
    "feature": ":rocket: Features",
    "fix": ":bug: Fixes",
    "tests": ":test_tube: Tests",
    "other": ":speech_balloon: Other",
    "docs": ":memo: Documentation",
    "maint": ":hammer_and_wrench: Maintenance"
  },
  "attributionTitleFormat": { "size": "h2", "format": ":star2: Contributors" },
  "attributionSubTitle": {
    "format": "Thank you to the following for contributing to the latest release"
  },
  "knownAuthors": [],
  "useDescriptiveIssues": true,
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

## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Installation

```sh
  npm install -g @joachimdalen/azext
```

### Developing

1. Clone the repo
   ```sh
   git clone https://github.com/joachimdalen/azext.git
   ```
2. Install dependencies
   ```sh
   > npm install
   ```
3. Build package
   ```sh
   > npm run build
   ```

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

- [ ] README generation from multiple files
- [ ] Creation of new repository from default template

See the [open issues](https://github.com/joachimdalen/azext/issues?q=is%3Aopen+is%3Aissue+label%3A%40type%2Ffeature) for a full list of proposed features.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are welcome, both in the form of suggestions and code. Create

If you want to contribute code, I ask that you follow some guidelines.

- New and changed features should to the best ability be covered by tests
- Follow the branching policy:
  - `feature/` for new features
  - `bugfix/` for bug fixes
  - `docs/` for documentation changes
- If your change is related to an issue, use the id as the first part of the branch e.g `bugfix/12-fix-crash-when-updating-rule`
- Pull requests should target the `develop` branch

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

If you have generic questions about the project or usage you can make contact in the following ways:

- Submit an issue with the `@type/question` label - [New Issue](https://github.com/joachimdalen/azext/issues/new)

<p align="right">(<a href="#top">back to top</a>)</p>
