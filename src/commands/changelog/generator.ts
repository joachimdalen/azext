import fs from 'fs/promises';

import { CliOptions } from './cli-args';
import MarkdownBuilder from './markdown-builder';
import prettier from 'prettier';
import { MetaDataLoader } from './metadata';

import chalk from 'chalk';
import Replacer from '../../core/replacer';
import { isNumber } from '../../core/utils';
import ChangelogConfig from './models/changelog-config';
import ChangelogDefinition from './models/changelog-definition';
import GeneratorContext from './models/generator-context';
import GitHubIssue from './models/github-issue';

class Generator {
  async generateChangelog(options: CliOptions) {
    const metadataLoader = new MetaDataLoader(options);
    const configString = await fs.readFile(options.config);
    const logString = await fs.readFile(options.log);

    const config: ChangelogConfig = JSON.parse(configString.toString());
    const log: ChangelogDefinition[] = JSON.parse(logString.toString());

    const context = await metadataLoader.loadMetadata(config, log);

    const filteredLogs =
      options.version !== undefined
        ? log.filter((z) => z.version === options.version)
        : log;

    if (filteredLogs.length === 0) {
      console.log(chalk.redBright('No changelog entries found'));
      return;
    }

    let fileContent = this.buildFile(context, filteredLogs);
    if (options.noFormat === false) {
      fileContent = prettier.format(fileContent, { parser: 'markdown' });
    }

    await fs.writeFile(options.output, fileContent);
    await metadataLoader.writeMetadataCache(context);
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
