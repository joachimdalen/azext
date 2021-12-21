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
import GeneratorContext from './models/generator-context';
import GitHubIssue from './models/github-issue';
import GitHubPullRequest from './models/github-pull-request';
import { GenerateChangelogOptions } from './options';

export interface GeneratorResult {
  latestVersion: string;
  outputPath: string;
}

class Generator {
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
        const prettier = require('prettier');
        fileContent = prettier.format(fileContent, { parser: 'markdown' });
      } else {
        throw new Error(
          'Prettier is not installed. Install module globally to enable formatting'
        );
      }
    }

    await fs.writeFile(options.output, fileContent);
    await metadataLoader.writeMetadataCache(context);
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

  buildFile(context: GeneratorContext, logs: ChangelogDefinition[]): string {
    const builder = new MarkdownBuilder();
    const replacer = new Replacer();
    const cfg = context.config;
    builder.addHeader(
      replacer.replaceEmojisIf(
        cfg.changelogTitle.format,
        cfg.replaceEmojis.changelogTitle
      ),
      cfg.changelogTitle.size
    );

    const getSection = (tags: string[], release: ChangelogDefinition) => {
      builder.addNewLine();
      const formattedHeader = replacer.replace(cfg.releaseTitleFormat.format, {
        version: release.version,
        publishDate: release.publishDate
      });
      builder.addHeader(
        replacer.replaceEmojisIf(
          formattedHeader,
          cfg.replaceEmojis.releaseTitle
        ),
        cfg.releaseTitleFormat.size
      );

      if (release.summary) {
        builder.addRaw(
          replacer.replaceEmojisIf(release.summary, cfg.replaceEmojis.summary)
        );
        builder.addNewLine();
      }
      if (release.notes) {
        builder.addNote(
          replacer.replaceEmojisIf(release.notes, cfg.replaceEmojis.notes)
        );

        builder.addNewLine();
      }

      tags.forEach((tag) => {
        const change = release.modules.flatMap((y) =>
          y.changes.filter((x) => x.type === tag)
        );

        if (change.length > 0) {
          const mappedTag = cfg.tagMapping[tag];
          if (mappedTag === undefined) {
            console.warn('No mapping found for module-name ' + tag);
          }

          builder.addHeader(
            replacer.replaceEmojisIf(mappedTag, cfg.replaceEmojis.tags),
            cfg.tagSize
          );
        }

        release.modules.forEach((rm) => {
          const change = rm.changes.filter((x) => x.type === tag);

          if (change.length > 0) {
            const formattedHeader = replacer.replace(
              cfg.moduleTitleFormat.format,
              {
                name: rm.name,
                version: rm.version
              }
            );
            builder.addHeader(
              replacer.replaceEmojisIf(
                formattedHeader,
                cfg.replaceEmojis.moduleTitle
              ),
              cfg.moduleTitleFormat.size
            );

            change.forEach((c) => {
              builder.addListItem(
                replacer.replaceEmojisIf(
                  c.description,
                  cfg.replaceEmojis.githubIssues
                )
              );

              if (c.issue !== undefined) {
                const ghIssue = context.issues.get(c.issue);

                if (ghIssue) {
                  builder.addSubListItem(
                    `Issue: ${getIssueLink(ghIssue, context.config)}`
                  );
                }

                if (c.pullRequest !== undefined) {
                  const ghPr = context.pullRequests.get(c.pullRequest);
                  if (ghPr) {
                    builder.addSubListItem(
                      `Pull Request: ${getPrLink(ghPr, context.config)}`
                    );
                  }
                }
              } else {
                if (c.pullRequest !== undefined) {
                  const ghPr = context.pullRequests.get(c.pullRequest);
                  if (ghPr) {
                    builder.addSubListItem(
                      `Issue: ${getPrLink(ghPr, context.config)}`
                    );
                  }
                }
              }
            });
          }
        });
      });

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
          console.log();
          if (x.submitter === undefined) return false;
          return !cfg.knownAuthors.includes(x.submitter);
        });
      console.log(
        `Found a total of ${nonAuthors.length} contributors for this release`
      );
      if (nonAuthors.length > 0) {
        builder.addHeader(
          replacer.replaceEmojisIf(
            cfg.attributionTitleFormat.format,
            cfg.replaceEmojis.attributionTitle
          ),
          cfg.attributionTitleFormat.size
        );
        builder.addHeader(
          replacer.replaceEmojisIf(
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

      builder.addSplitter();
    };

    const escapeText = (text: string): string => {
      return text
        .replace(/\[/, '\\[')
        .replace(/\]/, '\\]')
        .replace(/</, '\\<')
        .replace(/>/, '\\>');
    };

    const getIssueLink = (issue: GitHubIssue, config: ChangelogConfig) => {
      return config.useDescriptiveIssues
        ? `[GH#${issue.number} - ${escapeText(
            replacer.replaceEmojisIf(
              issue.title,
              cfg.replaceEmojis.githubIssues
            )
          )}](${issue.url})`
        : `[GH#${issue.number}](${issue.url})`;
    };
    const getPrLink = (
      pullRequest: GitHubPullRequest,
      config: ChangelogConfig
    ) => {
      return config.useDescriptivePullRequests
        ? `[GH#${pullRequest.number} - ${escapeText(
            replacer.replaceEmojisIf(
              pullRequest.title,
              cfg.replaceEmojis.githubPullRequests
            )
          )}](${pullRequest.url})`
        : `[PR#${pullRequest.number}](${pullRequest.url})`;
    };
    logs.forEach((l) => getSection(context.tags, l));
    return builder.get();
  }
}
export default Generator;
