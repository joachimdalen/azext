import GitHub from './github'
import { ChangelogCache, ChangelogConfig, ChangelogDefinition } from './models'
import fs from 'fs/promises'
import Replacer from './replacer'
import { GitHubIssue } from './types'
import commandLineArgs from 'command-line-args'
import cliArgs, { CliOptions } from './cli-args'
import MarkdownBuilder from './markdown-builder'
import prettier from 'prettier'
interface GeneratorContext {
  config: ChangelogConfig
  issues: Map<number, GitHubIssue>
  tags: string[]
}

const isNumber = (item: number | undefined): item is number => {
  return !!item
}
const isIssue = (item: GitHubIssue | undefined): item is GitHubIssue => {
  return !!item
}
class Generator {
  private readonly _github: GitHub
  constructor() {
    this._github = new GitHub()
  }
  async generateChangelog(options: CliOptions) {
    const configString = await fs.readFile(options.config)
    const logString = await fs.readFile(options.log)

    const config: ChangelogConfig = JSON.parse(configString.toString())
    const log: ChangelogDefinition[] = JSON.parse(logString.toString())

    const issueResponse = await Promise.all(
      log
        .flatMap((x) => x.modules.flatMap((x) => x.changes.map((x) => x.issue)))
        .filter(isNumber)
        .map((x) => this._github.getIssues(x, config.repository)),
    )
    const issues = issueResponse.filter(isIssue)
    const pullRequestIds = log
      .flatMap((x) =>
        x.modules.flatMap((x) => x.changes.map((x) => x.pullRequest)),
      )
      .filter(isNumber)

    const githubIssues = new Map<number, GitHubIssue>(
      issues.map((i) => [i.number, i]),
    )

    const distinctTags = log
      .flatMap((x) =>
        x.modules.flatMap((y) => y.changes.flatMap((z) => z.type)),
      )
      .filter((value, index, self) => {
        return self.indexOf(value) === index
      })

    const context: GeneratorContext = {
      config,
      issues: githubIssues,
      tags: distinctTags,
    }

    // const id = issues[0];
    // if (id !== undefined) {
    //   const issue = await this._github.getIssues(id, config.repository);
    //   console.log(issue);
    // }
    let fileContent = this.buildFile(context, log)
    if (options.noFormat === false) {
      fileContent = prettier.format(fileContent, { parser: 'markdown' })
    }

    await fs.writeFile(options.output, fileContent)
    if (options.generateCache) {
      const cache: ChangelogCache = {
        issues: [...githubIssues.values()],
      }
      await fs.writeFile('changelog-cache.json', JSON.stringify(cache, null, 2))
    }
  }

  buildFile(context: GeneratorContext, logs: ChangelogDefinition[]): string {
    var builder = new MarkdownBuilder()
    var replacer = new Replacer()
    builder.addH1('Changelog')

    const getSection = (tags: string[], release: ChangelogDefinition) => {
      builder.addNewLine()
      builder.addRaw(
        replacer.replace(context.config.releaseTitleFormat, {
          version: release.version,
          publishDate: release.publishDate,
        }),
      )

      tags.forEach((tag) => {
        const change = release.modules.flatMap((y) =>
          y.changes.filter((x) => x.type === tag),
        )

        if (change.length > 0) {
          builder.addRaw(context.config.tagMapping[tag])
        }

        release.modules.forEach((rm) => {
          const change = rm.changes.filter((x) => x.type === tag)

          if (change.length > 0) {
            builder.addRaw(
              replacer.replace(context.config.moduleTitleFormat, {
                name: rm.name,
                version: rm.version,
              }),
            )

            change.forEach((c) => {
              if (c.issue !== undefined) {
                const ghIssue = context.issues.get(c.issue)
                builder.addListItem(c.description)

                if (ghIssue) {
                  builder.addSubListItem(
                    `Reported in ${getIssueLink(ghIssue, context.config)}`,
                  )
                }
              } else {
                builder.addListItem(c.description)
              }
            })
          }
        })
      })

      const moduleIssues = release.modules
        .flatMap((x) => x.changes.flatMap((y) => y.issue))
        .filter(isNumber)
      const nonAuthors = [...context.issues.values()]
        .filter((x) => moduleIssues.includes(x.number))
        .filter((x) => {
          if (x.sumitter === undefined) return false
          return !context.config.knownAuthors.includes(x.sumitter)
        })

      if (nonAuthors.length > 0) {
        builder.addRaw(context.config.attributionTitleFormat)
        builder.addRaw(context.config.attributionSubTitle)

        nonAuthors.forEach((x) =>
          builder.addListItem(
            `[${x.sumitter}](https://github.com/${x.sumitter})`,
          ),
        )
      }

      builder.addSplitter()
    }

    const escapeText = (text: string): string => {
      return text
        .replaceAll('[', '\\[')
        .replaceAll(']', '\\]')
        .replaceAll('<', '\\<')
        .replaceAll('>', '\\>')
    }

    const getIssueLink = (issue: GitHubIssue, config: ChangelogConfig) => {
      const base = config.useDescriptiveIssues
        ? `[${escapeText(issue.title)}](${issue.url})`
        : `[GH#${issue.number}](${issue.url})`
      if (issue.sumitter === undefined) return base
      if (config.knownAuthors.includes(issue.sumitter)) return base
      const author = `[${issue.sumitter}](https://github.com/${issue.sumitter})`
      return `${base} - Thanks ${author}`
    }
    logs.forEach((l) => getSection(context.tags, l))
    return builder.get()
  }
}

const parseOptions = (): CliOptions => {
  const options = commandLineArgs(cliArgs)

  return {
    output: options.output,
    config: options.config,
    log: options.log,
    noFormat: options['no-format'],
    generateCache: options['generate-cache'],
    fromCache: options['from-cache'],
    cacheOutput: options['cache-output'],
    cacheFile: options['cache-file'],
  }
}

new Generator().generateChangelog(parseOptions()).then(() => console.log('ok'))
