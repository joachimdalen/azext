import { mergeChangelogConfig } from '../../../modules/changelog/merge-changelog-config';
import ChangelogConfig from '../../../modules/changelog/models/changelog-config';

describe('mergeChangelogConfig', () => {
  it('should merge config', () => {
    const userConfig: Partial<ChangelogConfig> = {
      repository: 'demo/test',
      typeResourcePrefixMapping: {
        docs: {
          issue: 'Something in:',
          pullRequest: 'Fixeded in:'
        }
      }
    };

    const config = mergeChangelogConfig(userConfig);

    expect(config).toEqual({
      repository: 'demo/test',
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
      moduleChangesTitle: {
        size: 'h3',
        format: ':package: Module changes'
      },
      typeSize: 'h3',
      typeMapping: {
        feature: ':rocket: Features',
        fix: ':bug: Fixes',
        tests: ':test_tube: Tests',
        other: ':speech_balloon: Other',
        docs: ':memo: Documentation'
      },
      typeResourcePrefixMapping: {
        docs: {
          issue: 'Something in:',
          pullRequest: 'Fixeded in:'
        }
      },
      attributionTitleFormat: {
        size: 'h2',
        format: ':star2: Contributors'
      },
      attributionSubTitle: {
        format:
          'Thank you to the following for contributing to the latest release'
      },
      attributionLinkTextFormat: {
        format: '@{{ghUsername}}'
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
        moduleChangesTitle: true,
        githubIssues: false,
        githubPullRequests: false,
        notes: true,
        summary: true
      }
    });
  });
});
