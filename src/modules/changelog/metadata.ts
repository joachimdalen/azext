import ConfigProvider from '../../data-providers/config-provider';
import ChangelogService from './changelog-service';
import ChangelogConfig from './models/changelog-config';
import ChangelogDefinition from './models/changelog-definition';
import GeneratorContext from './models/generator-context';
import GitHubIssue from './models/github-issue';
import GitHubPullRequest from './models/github-pull-request';
import { GenerateChangelogOptions } from './options';

export class MetaDataLoader {
  private readonly _options: GenerateChangelogOptions;
  private readonly _changelogService: ChangelogService;
  constructor(options: GenerateChangelogOptions) {
    this._options = options;
    this._changelogService = new ChangelogService();
  }

  async loadMetadata(config: ChangelogConfig, log: ChangelogDefinition[]) {
    let cachedIssues: GitHubIssue[] = [];
    let cachedPullRequests: GitHubPullRequest[] = [];

    if (this._options.fromCache) {
      const cache = await this._changelogService.populateCache({
        fresh: false,
        cacheName: this._options.cacheName,
        logName: this._options.logName,
        configName: this._options.configName
      });

      if (cache.issues) {
        cachedIssues = cache.issues;
      }
      if (cache.pullRequests) {
        cachedPullRequests = cache.pullRequests;
      }
    }

    const githubIssues = new Map<number, GitHubIssue>(
      cachedIssues.map((i) => [i.number, i])
    );
    const githubPullRequests = new Map<number, GitHubPullRequest>(
      cachedPullRequests.map((i) => [i.number, i])
    );

    const distinctTypes = log
      .flatMap((x) =>
        x.modules.flatMap((y) => y.changes.flatMap((z) => z.type))
      )
      .filter((value, index, self) => {
        return self.indexOf(value) === index;
      });

    const context: GeneratorContext = {
      config,
      issues: githubIssues,
      pullRequests: githubPullRequests,
      types: distinctTypes
    };

    return context;
  }
}
