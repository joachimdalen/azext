import { GitHubIssue, GitHubPullRequest } from './types'

export interface ChangelogDefinition {
  version: string
  publishDate: string
  modules: ChangelogModule[]
}

export interface ChangelogModule {
  version: string
  name: string
  changes: ChangelogEntry[]
}
export interface ChangelogEntry {
  type: string
  issue?: number
  pullRequest?: number
  description: string
}

export interface ChangelogCache {
  issues?: GitHubIssue[]
  pullRequests?: GitHubPullRequest[]
}

export interface ChangelogConfig {
  repository: string
  releaseTitleFormat: string
  moduleTitleFormat: string
  taskMapping: {
    [key: string]: string
  }
  sectionSplitter: string
  tagMapping: {
    [key: string]: string
  }
  knownAuthors: string[]
  useDescriptiveIssues: boolean
  attributionTitleFormat: string
  attributionSubTitle: string
}
export interface GeneratorContext {
  config: ChangelogConfig
  issues: Map<number, GitHubIssue>
  pullRequests: Map<number, GitHubPullRequest>
  tags: string[]
}
