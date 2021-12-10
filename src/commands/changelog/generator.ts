import fs from 'fs/promises';

import { CliOptions } from './cli-args';
import MarkdownBuilder from './markdown-builder';
import prettier from 'prettier';
import { MetaDataLoader } from './metadata';

import chalk from 'chalk';
import Replacer from '../../replacer';
import { isNumber } from '../../utils';
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
    builder.addHeader(
      context.config.changelogTitle.format,
      context.config.changelogTitle.size
    );

    const getSection = (tags: string[], release: ChangelogDefinition) => {
      builder.addNewLine();
      builder.addHeader(
        replacer.replace(context.config.releaseTitleFormat.format, {
          version: release.version,
          publishDate: release.publishDate
        }),
        context.config.releaseTitleFormat.size
      );

      tags.forEach((tag) => {
        const change = release.modules.flatMap((y) =>
          y.changes.filter((x) => x.type === tag)
        );

        if (change.length > 0) {
          builder.addHeader(
            context.config.tagMapping[tag],
            context.config.tagSize
          );
        }

        release.modules.forEach((rm) => {
          const change = rm.changes.filter((x) => x.type === tag);

          if (change.length > 0) {
            builder.addHeader(
              replacer.replace(context.config.moduleTitleFormat.format, {
                name: rm.name,
                version: rm.version
              }),
              context.config.moduleTitleFormat.size
            );

            change.forEach((c) => {
              if (c.issue !== undefined) {
                const ghIssue = context.issues.get(c.issue);
                builder.addListItem(c.description);

                if (ghIssue) {
                  builder.addSubListItem(
                    `Reported in ${getIssueLink(ghIssue, context.config)}`
                  );
                }
              } else {
                builder.addListItem(c.description);
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
          if (x.sumitter === undefined) return false;
          return !context.config.knownAuthors.includes(x.sumitter);
        });

      if (nonAuthors.length > 0) {
        builder.addHeader(
          context.config.attributionTitleFormat.format,
          context.config.attributionTitleFormat.size
        );
        builder.addHeader(
          context.config.attributionSubTitle.format,
          context.config.attributionSubTitle.size
        );

        nonAuthors.forEach((x) =>
          builder.addListItem(
            `[${x.sumitter}](https://github.com/${x.sumitter})`
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
        ? `[${escapeText(issue.title)}](${issue.url})`
        : `[GH#${issue.number}](${issue.url})`;
      if (issue.sumitter === undefined) return base;
      if (config.knownAuthors.includes(issue.sumitter)) return base;
      const author = `[${issue.sumitter}](https://github.com/${issue.sumitter})`;
      return `${base} - Thanks ${author}`;
    };
    logs.forEach((l) => getSection(context.tags, l));
    return builder.get();
  }
}
export default Generator;
