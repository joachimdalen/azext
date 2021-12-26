import ChangelogConfig from './models/changelog-config';
import ChangelogDefinition from './models/changelog-definition';

export const ADO_LATEST_VERSION = 'AZEXT_LATEST_VERSION';
export const ADO_OUTPUT_PATH = 'AZEXT_OUTPUT_PATH';
export const CHANGELOG_NAME = 'changelog.json';
export const CHANGELOG_OUTPUT_NAME = 'CHANGELOG.md';
export const CHANGELOG_CACHE_NAME = 'changelog-cache.json';
export const CHANGELOG_CONFIG_NAME = 'changelog-config.json';
export const CHANGELOG_DEFAULT_CONFIG: ChangelogConfig = {
  repository: '',
  changelogTitle: {
    size: 'h1',
    format: 'Changelog'
  },
  releaseTitleFormat: {
    size: 'h2',
    format: '{{version}} ({{publishDate}})'
  },
  moduleTitleFormat: {
    size: 'h4',
    format: '`{{name}}@{{version}}`'
  },
  rootChangesTitle: {
    size: 'h3',
    format: ':bookmark: Base changes'
  },
  moduleChangesTitle: {
    size: 'h3',
    format: ':package: Module changes'
  },
  sectionSplitter: '---',
  typeSize: 'h3',
  typeMapping: {
    feature: ':rocket: Features',
    fix: ':bug: Fixes',
    tests: ':test_tube: Tests',
    other: ':speech_balloon: Other',
    docs: ':memo: Documentation'
  },
  attributionTitleFormat: {
    size: 'h2',
    format: ':star2: Contributors'
  },
  attributionSubTitle: {
    format: 'Thank you to the following for contributing to the latest release'
  },
  knownAuthors: [],
  useDescriptiveIssues: true,
  useDescriptivePullRequests: true,
  replaceEmojis: {
    types: true,
    changelogTitle: true,
    releaseTitle: true,
    moduleTitle: true,
    attributionTitle: true,
    attributionSubTitle: true,
    rootChangesTitle: true,
    moduleChangesTitle: true,
    githubIssues: false,
    githubPullRequests: false,
    notes: true,
    summary: true
  }
};
export const CHANGELOG_DEFAULT_FILE: ChangelogDefinition = {
  publishDate: '01-01-1970',
  version: '0.0.0',
  notes: 'Optional notes',
  summary: 'Optional summary',
  modules: [
    {
      name: 'module-name',
      version: '0.0.0',
      changes: [
        {
          description: 'Some change description',
          type: 'feature',
          issue: 0,
          pullRequest: 0
        }
      ]
    }
  ]
};
