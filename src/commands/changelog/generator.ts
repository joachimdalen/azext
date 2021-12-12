import fs from 'fs/promises';

import { CliOptions } from './cli-args';
import MarkdownBuilder from './markdown-builder';
import { MetaDataLoader } from './metadata';

import chalk from 'chalk';
import Replacer from '../../core/replacer';
import { isNumber } from '../../core/utils';
import ChangelogConfig from './models/changelog-config';
import ChangelogDefinition from './models/changelog-definition';
import GeneratorContext from './models/generator-context';
import GitHubIssue from './models/github-issue';
import ConfigProvider from '../../data-providers/config-provider';
import { CHANGELOG_CONFIG_NAME, CHANGELOG_NAME } from './changelog-constants';
import { isModuleInstalled } from '../../core/addons-checker';

interface GeneratorResult {
  latestVersion: string;
  outputPath: string;
}

class Generator {
  async generateChangelog(
    options: CliOptions
  ): Promise<GeneratorResult | undefined> {
    const metadataLoader = new MetaDataLoader(options);
    const configProvider = new ConfigProvider();

    const config = await configProvider.getConfig<ChangelogConfig>(
      options.config || CHANGELOG_CONFIG_NAME
    );

    const log = await configProvider.getConfig<ChangelogDefinition[]>(
      options.log || CHANGELOG_NAME
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
    var builder = new MarkdownBuilder();
    var replacer = new Replacer();
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
          builder.addHeader(
            replacer.replaceEmojisIf(
              cfg.tagMapping[tag],
              cfg.replaceEmojis.tags
            ),
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
              if (c.issue !== undefined) {
                const ghIssue = context.issues.get(c.issue);
                builder.addListItem(
                  replacer.replaceEmojisIf(
                    c.description,
                    cfg.replaceEmojis.githubIssues
                  )
                );

                if (ghIssue) {
                  builder.addSubListItem(
                    `Reported in ${getIssueLink(ghIssue, context.config)}`
                  );
                }
              } else {
                builder.addListItem(
                  replacer.replaceEmojisIf(
                    c.description,
                    cfg.replaceEmojis.githubIssues
                  )
                );
              }
            });
          }
        });
      });

      const moduleIssues = release.modules
        .flatMap((x) => x.changes.flatMap((y) => y.issue))
        .filter(isNumber);
      const nonAuthors = [...context.issues.values()]
        .filter((x) => moduleIssues.includes(x.number))
        .filter((x) => {
          if (x.submitter === undefined) return false;
          return !cfg.knownAuthors.includes(x.submitter);
        });

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
            `[${x.submitter}](https://github.com/${x.submitter})`
          )
        );
      }

      builder.addSplitter();
    };

    const escapeText = (text: string): string => {
      return text
        .replaceAll('[', '\\[')
        .replaceAll(']', '\\]')
        .replaceAll('<', '\\<')
        .replaceAll('>', '\\>');
    };

    const getIssueLink = (issue: GitHubIssue, config: ChangelogConfig) => {
      const base = config.useDescriptiveIssues
        ? `[${escapeText(
            replacer.replaceEmojisIf(
              issue.title,
              cfg.replaceEmojis.githubIssues
            )
          )}](${issue.url})`
        : `[GH#${issue.number}](${issue.url})`;
      if (issue.submitter === undefined) return base;
      if (config.knownAuthors.includes(issue.submitter)) return base;
      const author = `[${issue.submitter}](https://github.com/${issue.submitter})`;
      return `${base} - Thanks ${author}`;
    };
    logs.forEach((l) => getSection(context.tags, l));
    return builder.get();
  }
}
export default Generator;
