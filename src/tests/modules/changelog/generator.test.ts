import Generator from '../../../modules/changelog/generator';
import ChangelogEntry from '../../../modules/changelog/models/changelog-entry';
import GeneratorContext from '../../../modules/changelog/models/generator-context';
import GitHubIssue from '../../../modules/changelog/models/github-issue';
import GitHubPullRequest from '../../../modules/changelog/models/github-pull-request';

describe('Generator', () => {
  describe('getGithubMeta', () => {
    it('should not add link when none defined', async () => {
      const generator = new Generator();

      const entry: ChangelogEntry = {
        type: 'fix',
        description: 'Add something'
      };

      const context: GeneratorContext = {
        types: ['fix'],
        config: {
          typeMapping: {
            fix: 'Bugfixes'
          },
          typeResourcePrefixMapping: {
            fix: {
              issue: 'Reported in',
              pullRequest: 'Fixed in'
            }
          }
        } as any,
        issues: new Map<number, GitHubIssue>(),
        pullRequests: new Map<number, GitHubPullRequest>()
      };

      const result = generator.getGithubMeta(entry, context);

      expect(result).toEqual('');
    });
    it('should add only issue when defined', async () => {
      const generator = new Generator();

      const entry: ChangelogEntry = {
        type: 'fix',
        description: 'Add something',
        issue: 1
      };

      const context: GeneratorContext = {
        types: ['fix'],
        config: {
          typeMapping: {
            fix: 'Bugfixes'
          },
          typeResourcePrefixMapping: {
            fix: {
              issue: 'Reported in',
              pullRequest: 'Fixed in'
            }
          }
        } as any,
        issues: new Map<number, GitHubIssue>([
          [
            1,
            {
              title: 'Some issue',
              id: 2221,
              number: 1,
              url: 'https://example/1',
              submitter: 'user1'
            }
          ]
        ]),
        pullRequests: new Map<number, GitHubPullRequest>()
      };

      const result = generator.getGithubMeta(entry, context);

      expect(result).toContain('- Reported in [GH#1](https://example/1)');
    });
    it('should add only pull request when defined', async () => {
      const generator = new Generator();

      const entry: ChangelogEntry = {
        type: 'fix',
        description: 'Add something',
        pullRequest: 1
      };

      const context: GeneratorContext = {
        types: ['fix'],
        config: {
          typeMapping: {
            fix: 'Bugfixes'
          },
          typeResourcePrefixMapping: {
            fix: {
              issue: 'Reported in',
              pullRequest: 'Fixed in'
            }
          }
        } as any,
        issues: new Map<number, GitHubIssue>(),
        pullRequests: new Map<number, GitHubPullRequest>([
          [
            1,
            {
              title: 'Some pr',
              id: 2221,
              number: 1,
              url: 'https://example/1',
              submitter: 'user1'
            }
          ]
        ])
      };

      const result = generator.getGithubMeta(entry, context);

      expect(result).toContain('- Fixed in [PR#1](https://example/1)');
    });
    it('should add issue and pull request when defined', async () => {
      const generator = new Generator();

      const entry: ChangelogEntry = {
        type: 'fix',
        description: 'Add something',
        pullRequest: 1,
        issue: 10
      };

      const context: GeneratorContext = {
        types: ['fix'],
        config: {
          typeMapping: {
            fix: 'Bugfixes'
          },
          typeResourcePrefixMapping: {
            fix: {
              issue: 'Reported in',
              pullRequest: 'Fixed in'
            }
          }
        } as any,
        issues: new Map<number, GitHubIssue>([
          [
            10,
            {
              title: 'Some issue',
              id: 2251,
              number: 10,
              url: 'https://example/10',
              submitter: 'user1'
            }
          ]
        ]),
        pullRequests: new Map<number, GitHubPullRequest>([
          [
            1,
            {
              title: 'Some pr',
              id: 2221,
              number: 1,
              url: 'https://example/1',
              submitter: 'user1'
            }
          ]
        ])
      };

      const result = generator.getGithubMeta(entry, context);

      expect(result).toContain('- Reported in [GH#10](https://example/10)');
      expect(result).toContain('- Fixed in [PR#1](https://example/1)');
    });
    it('should use descriptive when defined', async () => {
      const generator = new Generator();

      const entry: ChangelogEntry = {
        type: 'fix',
        description: 'Add something',
        pullRequest: 1,
        issue: 10
      };

      const context: GeneratorContext = {
        types: ['fix'],
        config: {
          typeMapping: {
            fix: 'Bugfixes'
          },
          typeResourcePrefixMapping: {
            fix: {
              issue: 'Reported in',
              pullRequest: 'Fixed in'
            }
          },
          useDescriptiveIssues: true,
          useDescriptivePullRequests: true,
          replaceEmojis: {
            githubIssues: false,
            githubPullRequests: false
          }
        } as any,
        issues: new Map<number, GitHubIssue>([
          [
            10,
            {
              title: 'Some issue',
              id: 2251,
              number: 10,
              url: 'https://example/10',
              submitter: 'user1'
            }
          ]
        ]),
        pullRequests: new Map<number, GitHubPullRequest>([
          [
            1,
            {
              title: 'Some pr',
              id: 2221,
              number: 1,
              url: 'https://example/1',
              submitter: 'user1'
            }
          ]
        ])
      };

      const result = generator.getGithubMeta(entry, context);

      expect(result).toContain(
        '- Reported in [GH#10 - Some issue](https://example/10)'
      );
      expect(result).toContain(
        '- Fixed in [PR#1 - Some pr](https://example/1)'
      );
    });
  });
});
