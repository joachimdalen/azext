import chalk from 'chalk';
import fs from 'fs/promises';

import { isModuleInstalled } from '../../core/addons-checker';
import Replacer from '../../core/replacer';
import { distinct, getChangesForDefinition, isNumber } from '../../core/utils';
import ConfigProvider from '../../data-providers/config-provider';
import { CHANGELOG_CONFIG_NAME, CHANGELOG_NAME } from './changelog-constants';
import MarkdownBuilder from './markdown-builder';
import { mergeChangelogConfig } from './merge-changelog-config';
import { MetaDataLoader } from './metadata';
import ChangelogConfig from './models/changelog-config';
import ChangelogDefinition from './models/changelog-definition';
import ChangelogEntry from './models/changelog-entry';
import GeneratorContext from './models/generator-context';
import GitHubIssue from './models/github-issue';
import GitHubPullRequest from './models/github-pull-request';
import TypeResourcePrefix from './models/type-resource-prefix';
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

    const userConfig = await configProvider.getConfig<Partial<ChangelogConfig>>(
      options.configName || CHANGELOG_CONFIG_NAME
    );

    const log = await configProvider.getConfig<ChangelogDefinition[]>(
      options.logName || CHANGELOG_NAME
    );

    if (userConfig == undefined) {
      console.log('Failed to load config');
      return;
    }
    if (log === undefined) {
      console.log('Failed to load changelog');
      return;
    }

    const config = mergeChangelogConfig(userConfig);
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

  private getResourceLink(
    cfg: ChangelogConfig,
    type: string
  ): TypeResourcePrefix {
    const typeMap = cfg.typeResourcePrefixMapping[type];

    if (typeMap === undefined) {
      return {
        issue: 'Issue:',
        pullRequest: 'Pull Request:'
      };
    }

    return typeMap;
  }

  public getGithubIssue(
    issueId: number,
    resourceLink: TypeResourcePrefix,
    context: GeneratorContext,
    removePrefix: boolean
  ) {
    const ghIssue = context.issues.get(issueId);

    if (ghIssue) {
      const link = this.getIssueLink(ghIssue, context.config);
      return removePrefix ? link : `${resourceLink.issue} ${link}`;
    }

    return undefined;
  }

  public getGithubPr(
    prId: number,
    resourceLink: TypeResourcePrefix,
    context: GeneratorContext,
    removePrefix: boolean
  ) {
    const ghPr = context.pullRequests.get(prId);

    if (ghPr) {
      const link = this.getPrLink(ghPr, context.config);
      return removePrefix ? link : `${resourceLink.pullRequest} ${link}`;
    }

    return undefined;
  }

  public getGithubMeta(entry: ChangelogEntry, context: GeneratorContext) {
    const builder = new MarkdownBuilder();
    const resourceLink = this.getResourceLink(context.config, entry.type);

    if (entry.issue !== undefined) {
      const isMultiple = Array.isArray(entry.issue);
      const issueIds: number[] = Array.isArray(entry.issue)
        ? entry.issue
        : [entry.issue];

      if (isMultiple && resourceLink?.issue) {
        builder.addSubListItem(resourceLink.issue);
      }

      for (const issueId of issueIds) {
        const issue = this.getGithubIssue(
          issueId,
          resourceLink,
          context,
          isMultiple
        );
        if (issue) {
          builder.addSubListItem(issue, isMultiple);
        }
      }
    }

    if (entry.pullRequest !== undefined) {
      const isMultiple = Array.isArray(entry.pullRequest);
      const prIds: number[] = Array.isArray(entry.pullRequest)
        ? entry.pullRequest
        : [entry.pullRequest];

      if (isMultiple && resourceLink?.pullRequest) {
        builder.addSubListItem(resourceLink.pullRequest);
      }

      for (const prId of prIds) {
        const pr = this.getGithubPr(prId, resourceLink, context, isMultiple);
        if (pr) {
          builder.addSubListItem(pr, isMultiple);
        }
      }
    }

    return builder.get();
  }

  public getSections(
    definition: ChangelogDefinition,
    context: GeneratorContext
  ) {
    if (definition.sections === undefined) return '';

    const builder = new MarkdownBuilder();
    const sectionNames = Object.keys(definition.sections);

    for (const name of sectionNames) {
      const sectionConfig =
        context.config.sections && context.config.sections[name];

      if (sectionConfig?.title) {
        builder.addHeader(
          this._replacer.replace(
            this._replacer.replaceEmojisIf(
              sectionConfig.title.format,
              context.config.replaceEmojis.sectionTitle
            ),
            {}
          ),
          sectionConfig.title.size
        );
        builder.addNewLine();
      }

      for (const section of definition.sections[name]) {
        const replacedContent = this._replacer.replaceEmojisIf(
          section.content,
          context.config.replaceEmojis.sectionContent
        );

        switch (section.type) {
          case 'list-item':
            builder.addListItem(replacedContent);
            break;
          case 'quote':
            builder.addNewLine();
            builder.addQuote(replacedContent);
            break;
          case 'text':
            builder.addNewLine();
            builder.addRaw(replacedContent);
            break;
          default:
            throw new Error(
              `Unknown section type ${section.type} in section ${name}`
            );
        }
      }

      builder.addNewLine();
    }

    builder.addSplitter();
    return builder.get();
  }

  private addChanges(
    builder: MarkdownBuilder,
    cfg: ChangelogConfig,
    context: GeneratorContext,
    changes: ChangelogEntry[]
  ) {
    changes.forEach((c) => {
      builder.addListItem(
        this._replacer.replaceEmojisIf(
          c.description,
          cfg.replaceEmojis.githubIssues
        )
      );

      builder.addRaw(this.getGithubMeta(c, context));
    });
  }

  private addTypeHeader(
    builder: MarkdownBuilder,
    cfg: ChangelogConfig,
    type: string,
    count?: number
  ) {
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
          changeCount: count || undefined
        }
      ),
      cfg.typeSize
    );
  }

  private addRootChanges(
    builder: MarkdownBuilder,
    cfg: ChangelogConfig,
    release: ChangelogDefinition,
    context: GeneratorContext
  ) {
    if (release.changes === undefined) return;
    for (const type of context.types) {
      const change = release.changes.filter((x) => x.type === type);

      if (change.length > 0) {
        this.addTypeHeader(builder, cfg, type, change?.length);
      }

      const changes = release.changes?.filter((x) => x.type === type);
      this.addChanges(builder, cfg, context, changes);
    }
  }

  private addModuleChanges(
    builder: MarkdownBuilder,
    cfg: ChangelogConfig,
    release: ChangelogDefinition,
    context: GeneratorContext
  ) {
    if (!release.modules) return;

    if (cfg.moduleChangesTitle && release.changes !== undefined) {
      builder.addHeader(
        this._replacer.replaceEmojisIf(
          cfg.moduleChangesTitle.format,
          cfg.replaceEmojis.moduleChangesTitle
        ),
        cfg.moduleChangesTitle.size
      );
    }

    for (const type of context.types) {
      const change = release.modules.flatMap((y) =>
        y.changes.filter((x) => x.type === type)
      );

      if (change.length > 0) {
        this.addTypeHeader(builder, cfg, type, change?.length);
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

          this.addChanges(builder, cfg, context, change);
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
      ? `[PR#${pullRequest.number} - ${this.escapeText(
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
    const changes = getChangesForDefinition(release);

    const moduleIssues = changes.flatMap((x) => x.issue).filter(isNumber);
    const modulePrs = changes.flatMap((x) => x.pullRequest).filter(isNumber);

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

      const distinctAuthors = nonAuthors
        .map((v: GitHubIssue | GitHubPullRequest) => v.submitter)
        .filter(distinct);

      distinctAuthors.forEach((authorName) =>
        builder.addListItem(
          `[${this._replacer.replace(cfg.attributionLinkTextFormat.format, {
            ghUsername: authorName
          })}](https://github.com/${authorName})`
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

    builder.addRaw(this.getSections(release, context));

    if (release.changes) {
      this.addRootChanges(builder, cfg, release, context);
    }

    if (release.modules) {
      this.addModuleChanges(builder, cfg, release, context);
    }

    this.addContributors(builder, cfg, release, context);
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

      if (logs.indexOf(version) !== logs.length) {
        builder.addSplitter();
      }
    }
    return builder.get();
  }
}
export default Generator;
