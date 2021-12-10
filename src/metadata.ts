import chalk from 'chalk';
import { CliOptions } from './cli-args';
import GitHub from './github';
import fs from 'fs/promises';
import { isIssue, isPullRequest, isNumber } from './utils';
import ChangelogCache from './models/changelog-cache';
import ChangelogConfig from './models/changelog-config';
import ChangelogDefinition from './models/changelog-definition';
import GeneratorContext from './models/generator-context';
import GitHubIssue from './models/github-issue';
import GitHubPullRequest from './models/github-pull-request';

export class MetaDataLoader {
  private readonly _github: GitHub;
  private readonly _options: CliOptions;
  constructor(options: CliOptions) {
    this._github = new GitHub();
    this._options = options;
  }

  async fileExtists(path: string) {
    try {
      await fs.stat(path);
      return true;
    } catch (error) {
      return false;
    }
  }

  async loadMetadata(config: ChangelogConfig, log: ChangelogDefinition[]) {
    let cachedIssues: GitHubIssue[] = [];
    let cachedPullRequests: GitHubPullRequest[] = [];

    if (this._options.fromCache) {
      const exists = await this.fileExtists(this._options.cacheFile);

      if (exists) {
        const cacheString = await fs.readFile(this._options.cacheFile);
        const parsedCache: ChangelogCache = JSON.parse(cacheString.toString());
        if (parsedCache.issues !== undefined) {
          console.log(
            `ℹ️ Loaded ${chalk.cyanBright(
              parsedCache.issues.length
            )} from issue cache`
          );
          cachedIssues = parsedCache.issues;
        }
        if (parsedCache.pullRequests !== undefined) {
          console.log(
            `ℹ️ Loaded ${chalk.cyanBright(
              parsedCache.pullRequests.length
            )} from pull request cache`
          );
          cachedPullRequests = parsedCache.pullRequests;
        }
      } else {
        console.log(
          chalk.yellowBright('⚠️ Cache file not found, assuming first run')
        );
      }
    }

    const issueIds = log
      .flatMap((x) => x.modules.flatMap((x) => x.changes.map((x) => x.issue)))
      .filter(isNumber)
      .filter((y) => !cachedIssues.some((x) => x.number === y));
    console.log(
      `ℹ️ Found ${chalk.cyanBright(issueIds.length)} issues not in cache`
    );
    const issueResponse = await Promise.all(
      issueIds.map((x) => this._github.getIssues(x, config.repository))
    );
    const issues: GitHubIssue[] = issueResponse
      .filter(isIssue)
      .concat(cachedIssues);
    const pullRequestResponse = await Promise.all(
      log
        .flatMap((x) =>
          x.modules.flatMap((x) => x.changes.map((x) => x.pullRequest))
        )
        .filter(isNumber)
        .filter((y) => !cachedIssues.some((x) => x.number === y))
        .map((x) => this._github.getPullRequests(x, config.repository))
    );
    const pullRequests: GitHubPullRequest[] = pullRequestResponse
      .filter(isPullRequest)
      .concat(cachedPullRequests);

    const githubIssues = new Map<number, GitHubIssue>(
      issues.map((i) => [i.number, i])
    );
    const githubPullRequests = new Map<number, GitHubPullRequest>(
      pullRequests.map((i) => [i.number, i])
    );

    const distinctTags = log
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
      tags: distinctTags
    };

    return context;
  }

  async writeMetadataCache(context: GeneratorContext) {
    if (this._options.generateCache) {
      const cache: ChangelogCache = {
        issues: [...context.issues.values()],
        pullRequests: [...context.pullRequests.values()]
      };
      await fs.writeFile(
        this._options.cacheOutput,
        JSON.stringify(cache, null, 2)
      );
    }
  }
}
