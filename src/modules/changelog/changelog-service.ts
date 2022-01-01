import chalk from 'chalk';

import { ActionResult } from '../../constants';
import {
  distinct,
  getChangesForAllDefinition,
  isIssue,
  isNumber,
  isPullRequest
} from '../../core';
import ConfigProvider from '../../data-providers/config-provider';
import GitHub from '../../data-providers/github';
import {
  CHANGELOG_CACHE_NAME,
  CHANGELOG_CONFIG_NAME,
  CHANGELOG_DEFAULT_CONFIG,
  CHANGELOG_DEFAULT_FILE,
  CHANGELOG_NAME
} from './changelog-constants';
import { mergeConfig } from './config-merge';
import Generator, { GeneratorResult } from './generator';
import ChangelogCache from './models/changelog-cache';
import ChangelogConfig from './models/changelog-config';
import ChangelogDefinition from './models/changelog-definition';
import GitHubIssue from './models/github-issue';
import GitHubPullRequest from './models/github-pull-request';
import {
  CacheChangelogOptions,
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
    options: CacheChangelogOptions
  ): Promise<ChangelogCache> {
    let cache: ChangelogCache = {
      issues: [],
      pullRequests: []
    };
    const userConfig = await this._configProvider.getConfig<
      Partial<ChangelogConfig>
    >(options.configName || CHANGELOG_CONFIG_NAME);

    if (userConfig == undefined)
      throw new Error('Failed to load changelog configuration');

    const config = mergeConfig(userConfig);

    const changelog = await this._configProvider.getConfig<
      ChangelogDefinition[]
    >(options.logName || CHANGELOG_NAME);

    if (changelog == undefined) throw new Error('Failed to load changelog');

    if (!options.fresh) {
      const existingCache =
        await this._configProvider.getConfig<ChangelogCache>(
          options.cacheName || CHANGELOG_CACHE_NAME
        );

      if (existingCache !== undefined) {
        if (existingCache.issues !== undefined) {
          console.log(
            `ℹ️ Loaded ${chalk.cyanBright(
              existingCache.issues.length
            )} from issue cache`
          );
        }
        if (existingCache.pullRequests !== undefined) {
          console.log(
            `ℹ️ Loaded ${chalk.cyanBright(
              existingCache.pullRequests.length
            )} from pull request cache`
          );
        }
        cache = existingCache;
      }
    }

    if (cache.issues) {
      const allModules = getChangesForAllDefinition(changelog);
      const issueIds = allModules
        .map((x) => x.issue)
        .filter(isNumber)
        .filter(distinct)
        .filter((y) => !cache.issues?.some((x) => x.number === y));
      if (issueIds?.length > 0) {
        console.log(
          `ℹ️ Found ${chalk.cyanBright(issueIds.length)} issues not in cache`
        );
      }
      const issueResponse = await Promise.all(
        issueIds.map((x) => this._github.getIssues(x, config.repository))
      );
      const issues: GitHubIssue[] = issueResponse
        .filter(isIssue)
        .concat(cache.issues);

      cache.issues = issues;
    }

    if (cache.pullRequests) {
      const allModules = getChangesForAllDefinition(changelog);

      const prIds = allModules
        .map((x) => x.pullRequest)
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
        prIds.map((x) => this._github.getPullRequests(x, config.repository))
      );
      const pullRequests: GitHubPullRequest[] = pullRequestResponse
        .filter(isPullRequest)
        .concat(cache.pullRequests);

      cache.pullRequests = pullRequests;
    }

    await this._configProvider.writeConfig(
      options.cacheName || CHANGELOG_CACHE_NAME,
      cache
    );

    return cache;
  }
}
export default ChangelogService;
