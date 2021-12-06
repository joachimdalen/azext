import GitHub from './github'
import { ChangelogConfig, ChangelogDefinition } from './models'
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

    const issues = log.flatMap((x) =>
      x.modules.flatMap((x) => x.changes.map((x) => x.issue)),
    )
    const pullRequestIds = log.flatMap((x) =>
      x.modules.flatMap((x) => x.changes.map((x) => x.pullRequest)),
    )

    const githubIssues = new Map<number, GitHubIssue>()

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
    if (options.noFormat) {
      fileContent = prettier.format(fileContent, { parser: 'markdown' })
    }
    await fs.writeFile(options.output, fileContent)
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
              let desc = c.description
              if (c.issue) {
                const ghIssue = context.issues.get(c.issue)
                if (ghIssue) desc = `${c.description} ${getIssueLink(ghIssue)}`
              }
              builder.addListItem(desc)
            })
          }
        })
      })
      builder.addSplitter()
    }

    const getIssueLink = (issue: GitHubIssue) =>
      `[GH#${issue.number}](${issue.url})`
    logs.forEach((l) => getSection(context.tags, l))
    return builder.get()
  }
}

const options: CliOptions = commandLineArgs(cliArgs) as CliOptions
new Generator().generateChangelog(options).then(() => console.log('ok'))
