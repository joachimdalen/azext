import chalk from 'chalk';
import fs from 'fs/promises';

import { isModuleInstalled } from '../../core/addons-checker';
import Replacer from '../../core/replacer';
import { isNumber } from '../../core/utils';
import ConfigProvider from '../../data-providers/config-provider';
import { CHANGELOG_CONFIG_NAME, CHANGELOG_NAME } from './changelog-constants';
import MarkdownBuilder from './markdown-builder';
import { MetaDataLoader } from './metadata';
import ChangelogConfig from './models/changelog-config';
import ChangelogDefinition from './models/changelog-definition';
import ChangelogEntry from './models/changelog-entry';
import GeneratorContext from './models/generator-context';
import GitHubIssue from './models/github-issue';
import GitHubPullRequest from './models/github-pull-request';
import { GenerateChangelogOptions } from './options';

export interface GeneratorResult {
  latestVersion: string;
  outputPath: string;
}

class Generator {
  private readonly _replacer: Replacer;
  constructor() {
    this._replacer = new Replacer();
  }
  async generateChangelog(
    options: GenerateChangelogOptions
  ): Promise<GeneratorResult | undefined> {
    const metadataLoader = new MetaDataLoader(options);
    const configProvider = new ConfigProvider();

    const config = await configProvider.getConfig<ChangelogConfig>(
      options.configName || CHANGELOG_CONFIG_NAME
    );

    const log = await configProvider.getConfig<ChangelogDefinition[]>(
      options.logName || CHANGELOG_NAME
    );

    if (config == undefined) {
      console.log('Failed to load config');
      return;
    }
    if (log === undefined) {
      console.log('Failed to load changelog');
      return;
    }

    const context = await metadataLoader.loadMetadata(config, log);

    const filteredLogs =
      options.version !== undefined
        ? log.filter((z) => z.version === options.version)
        : log;

    if (filteredLogs.length === 0) {
      console.log(chalk.redBright('No changelog entries found'));
      return undefined;
    }

    let fileContent = this.buildFile(context, filteredLogs);

    if (options.format) {
      if (isModuleInstalled('prettier')) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const prettier = require('prettier/standalone');
        const plugins = [require('prettier/parser-markdown')];
        fileContent = prettier.format(fileContent, {
          parser: 'markdown',
          plugins
        });
      } else {
        throw new Error(
          'Prettier is not installed. Install module globally to enable formatting'
        );
      }
    }

    await fs.writeFile(options.output, fileContent);
    return {
      latestVersion: this.getLatestVersion(filteredLogs),
      outputPath: options.output
    };
  }

  getLatestVersion(logs: ChangelogDefinition[]): string {
    return logs.sort(function (a, b) {
      return (
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
      );
    })[0].publishDate;
  }

  private addSectionHeader(
    builder: MarkdownBuilder,
    cfg: ChangelogConfig,
    release: ChangelogDefinition
  ) {
    const formattedHeader = this._replacer.replace(
      cfg.releaseTitleFormat.format,
      {
        version: release.version,
        publishDate: release.publishDate
      }
    );
    builder.addHeader(
      this._replacer.replaceEmojisIf(
        formattedHeader,
        cfg.replaceEmojis.releaseTitle
      ),
      cfg.releaseTitleFormat.size
    );
  }

  private addSummaryAndNotes(
    builder: MarkdownBuilder,
    cfg: ChangelogConfig,
    release: ChangelogDefinition
  ) {
    if (release.summary) {
      builder.addRaw(
        this._replacer.replaceEmojisIf(
          release.summary,
          cfg.replaceEmojis.summary
        )
      );
      builder.addNewLine();
    }
    if (release.notes) {
      builder.addNote(
        this._replacer.replaceEmojisIf(release.notes, cfg.replaceEmojis.notes)
      );

      builder.addNewLine();
    }
  }

  private addGitHubMeta(
    entry: ChangelogEntry,
    builder: MarkdownBuilder,
    context: GeneratorContext
  ) {
    if (entry.issue !== undefined) {
      const ghIssue = context.issues.get(entry.issue);

      if (ghIssue) {
        builder.addSubListItem(
          `Issue: ${this.getIssueLink(ghIssue, context.config)}`
        );
      }

      if (entry.pullRequest !== undefined) {
        const ghPr = context.pullRequests.get(entry.pullRequest);
        if (ghPr) {
          builder.addSubListItem(
            `Pull Request: ${this.getPrLink(ghPr, context.config)}`
          );
        }
      }
    } else {
      if (entry.pullRequest !== undefined) {
        const ghPr = context.pullRequests.get(entry.pullRequest);
        if (ghPr) {
          builder.addSubListItem(
            `Pull Request: ${this.getPrLink(ghPr, context.config)}`
          );
        }
      }
    }
  }

  private addModuleChanges(
    builder: MarkdownBuilder,
    cfg: ChangelogConfig,
    release: ChangelogDefinition,
    context: GeneratorContext
  ) {
    for (const type of context.types) {
      const change = release.modules.flatMap((y) =>
        y.changes.filter((x) => x.type === type)
      );

      if (change.length > 0) {
        const mappedTypeTitle = cfg.typeMapping[type];
        if (mappedTypeTitle === undefined) {
          console.warn('No mapping found for change type ' + type);
        }

        builder.addHeader(
          this._replacer.replace(
            this._replacer.replaceEmojisIf(
              mappedTypeTitle,
              cfg.replaceEmojis.types
            ),
            {
              changeCount: change?.length || undefined
            }
          ),
          cfg.typeSize
        );
      }

      release.modules.forEach((rm) => {
        const change = rm.changes.filter((x) => x.type === type);

        if (change.length > 0) {
          const formattedHeader = this._replacer.replace(
            cfg.moduleTitleFormat.format,
            {
              name: rm.name,
              version: rm.version
            }
          );
          builder.addHeader(
            this._replacer.replaceEmojisIf(
              formattedHeader,
              cfg.replaceEmojis.moduleTitle
            ),
            cfg.moduleTitleFormat.size
          );

          change.forEach((c) => {
            builder.addListItem(
              this._replacer.replaceEmojisIf(
                c.description,
                cfg.replaceEmojis.githubIssues
              )
            );

            this.addGitHubMeta(c, builder, context);
          });
        }
      });
    }
  }

  private getIssueLink(issue: GitHubIssue, config: ChangelogConfig): string {
    return config.useDescriptiveIssues
      ? `[GH#${issue.number} - ${this.escapeText(
          this._replacer.replaceEmojisIf(
            issue.title,
            config.replaceEmojis.githubIssues
          )
        )}](${issue.url})`
      : `[GH#${issue.number}](${issue.url})`;
  }
  private getPrLink(
    pullRequest: GitHubPullRequest,
    config: ChangelogConfig
  ): string {
    return config.useDescriptivePullRequests
      ? `[GH#${pullRequest.number} - ${this.escapeText(
          this._replacer.replaceEmojisIf(
            pullRequest.title,
            config.replaceEmojis.githubPullRequests
          )
        )}](${pullRequest.url})`
      : `[PR#${pullRequest.number}](${pullRequest.url})`;
  }

  private addContributors(
    builder: MarkdownBuilder,
    cfg: ChangelogConfig,
    release: ChangelogDefinition,
    context: GeneratorContext
  ) {
    const moduleIssues = release.modules
      .flatMap((x) => x.changes.flatMap((y) => y.issue))
      .filter(isNumber);
    const modulePrs = release.modules
      .flatMap((x) => x.changes.flatMap((y) => y.pullRequest))
      .filter(isNumber);

    const nonAuthors = [
      ...context.issues.values(),
      ...context.pullRequests.values()
    ]
      .filter(
        (x) => moduleIssues.includes(x.number) || modulePrs.includes(x.number)
      )
      .filter((x) => {
        if (x.submitter === undefined) return false;
        return !cfg.knownAuthors.includes(x.submitter);
      });

    if (nonAuthors.length > 0) {
      console.log(
        `Found a total of ${nonAuthors.length} contributors for release ${release.version}`
      );
      builder.addHeader(
        this._replacer.replaceEmojisIf(
          cfg.attributionTitleFormat.format,
          cfg.replaceEmojis.attributionTitle
        ),
        cfg.attributionTitleFormat.size
      );
      builder.addHeader(
        this._replacer.replaceEmojisIf(
          cfg.attributionSubTitle.format,
          cfg.replaceEmojis.attributionSubTitle
        ),

        cfg.attributionSubTitle.size
      );

      nonAuthors.forEach((x) =>
        builder.addListItem(
          `[@${x.submitter}](https://github.com/${x.submitter})`
        )
      );
    }
  }

  private escapeText(text: string): string {
    return text
      .replace(/\[/, '\\[')
      .replace(/\]/, '\\]')
      .replace(/</, '\\<')
      .replace(/>/, '\\>');
  }

  private addVersion(
    builder: MarkdownBuilder,
    cfg: ChangelogConfig,
    release: ChangelogDefinition,
    context: GeneratorContext
  ) {
    builder.addNewLine();

    this.addSectionHeader(builder, cfg, release);
    this.addSummaryAndNotes(builder, cfg, release);
    this.addModuleChanges(builder, cfg, release, context);
    this.addContributors(builder, cfg, release, context);
    builder.addSplitter();
  }

  buildFile(context: GeneratorContext, logs: ChangelogDefinition[]): string {
    const builder = new MarkdownBuilder();

    const cfg = context.config;
    builder.addHeader(
      this._replacer.replaceEmojisIf(
        cfg.changelogTitle.format,
        cfg.replaceEmojis.changelogTitle
      ),
      cfg.changelogTitle.size
    );

    for (const version of logs) {
      this.addVersion(builder, cfg, version, context);
    }
    return builder.get();
  }
}
export default Generator;
