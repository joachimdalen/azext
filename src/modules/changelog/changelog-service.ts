import chalk from 'chalk';

import { ActionResult } from '../../constants';
import { distinct, isIssue, isNumber, isPullRequest } from '../../core';
import ConfigProvider from '../../data-providers/config-provider';
import GitHub from '../../data-providers/github';
import {
  CHANGELOG_CACHE_NAME,
  CHANGELOG_CONFIG_NAME,
  CHANGELOG_DEFAULT_CONFIG,
  CHANGELOG_DEFAULT_FILE
} from './changelog-constants';
import Generator, { GeneratorResult } from './generator';
import ChangelogCache from './models/changelog-cache';
import ChangelogConfig from './models/changelog-config';
import ChangelogDefinition from './models/changelog-definition';
import GitHubIssue from './models/github-issue';
import GitHubPullRequest from './models/github-pull-request';
import {
  GenerateChangelogOptions,
  NewChangelogConfigOptions,
  NewChangelogOptions
} from './options';

class ChangelogService {
  private readonly _configProvider: ConfigProvider;
  private readonly _generator: Generator;
  private readonly _github: GitHub;
  constructor() {
    this._configProvider = new ConfigProvider();
    this._generator = new Generator();
    this._github = new GitHub();
  }

  async generate(
    options: GenerateChangelogOptions
  ): Promise<GeneratorResult | undefined> {
    const result = await this._generator.generateChangelog(options);
    return result;
  }
  async createDefaultConfig(
    options: NewChangelogConfigOptions
  ): Promise<ActionResult> {
    const exists = await this._configProvider.getConfig<ChangelogConfig>(
      CHANGELOG_CONFIG_NAME
    );

    if (exists !== undefined && !options.force) {
      return {
        isSuccess: false,
        message: 'Config file already exists, use --force to overwrite'
      };
    }

    const writtenPath = await this._configProvider.writeConfig(
      CHANGELOG_CONFIG_NAME,
      CHANGELOG_DEFAULT_CONFIG
    );

    return {
      isSuccess: true,
      message: `Wrote new configuration file to ${writtenPath}`
    };
  }
  async createNewFile(options: NewChangelogOptions): Promise<ActionResult> {
    const exists = await this._configProvider.getConfig<ChangelogConfig>(
      options.outputName
    );

    if (exists !== undefined) {
      return {
        isSuccess: false,
        message: 'Changelog file already exists'
      };
    }

    const writtenPath = await this._configProvider.writeConfig(
      options.outputName,
      [CHANGELOG_DEFAULT_FILE]
    );

    return {
      isSuccess: true,
      message: `New changelog written to ${writtenPath}`
    };
  }

  public async populateCache(
    repository: string,
    changelog: ChangelogDefinition[],
    cacheName = CHANGELOG_CACHE_NAME,
    fresh = false
  ): Promise<ChangelogCache> {
    const cache: ChangelogCache = {
      issues: [],
      pullRequests: []
    };

    if (!fresh) {
      const existingCache =
        await this._configProvider.getConfig<ChangelogCache>(cacheName);

      if (existingCache !== undefined) {
        if (cache.issues !== undefined) {
          console.log(
            `ℹ️ Loaded ${chalk.cyanBright(
              cache.issues.length
            )} from issue cache`
          );
        }
        if (cache.pullRequests !== undefined) {
          console.log(
            `ℹ️ Loaded ${chalk.cyanBright(
              cache.pullRequests.length
            )} from pull request cache`
          );
        }
      }
    }

    if (cache.issues) {
      const issueIds = changelog
        .flatMap((x) => x.modules.flatMap((x) => x.changes.map((x) => x.issue)))
        .filter(isNumber)
        .filter(distinct)
        .filter((y) => !cache.issues?.some((x) => x.number === y));
      if (issueIds?.length > 0) {
        console.log(
          `ℹ️ Found ${chalk.cyanBright(issueIds.length)} issues not in cache`
        );
      }
      const issueResponse = await Promise.all(
        issueIds.map((x) => this._github.getIssues(x, repository))
      );
      const issues: GitHubIssue[] = issueResponse
        .filter(isIssue)
        .concat(cache.issues);

      cache.issues = issues;
    }

    if (cache.pullRequests) {
      const prIds = changelog
        .flatMap((x) =>
          x.modules.flatMap((x) => x.changes.map((x) => x.pullRequest))
        )
        .filter(isNumber)
        .filter(distinct)
        .filter((y) => !cache.pullRequests?.some((x) => x.number === y));
      if (prIds?.length > 0) {
        console.log(
          `ℹ️ Found ${chalk.cyanBright(
            prIds.length
          )} pull requests not in cache`
        );
      }

      const pullRequestResponse = await Promise.all(
        prIds.map((x) => this._github.getPullRequests(x, repository))
      );
      const pullRequests: GitHubPullRequest[] = pullRequestResponse
        .filter(isPullRequest)
        .concat(cache.pullRequests);

      cache.pullRequests = pullRequests;
    }

    return cache;
  }
}
export default ChangelogService;
