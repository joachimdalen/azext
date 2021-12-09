import { GitHubIssue, GitHubPullRequest } from './types'

export const isNumber = (item: number | undefined): item is number => {
  return !!item
}
export const isIssue = (item: GitHubIssue | undefined): item is GitHubIssue => {
  return !!item
}
export const isPullRequest = (
  item: GitHubPullRequest | undefined,
): item is GitHubPullRequest => {
  return !!item
}
