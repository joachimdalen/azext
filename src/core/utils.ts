import GitHubIssue from '../modules/changelog/models/github-issue';
import GitHubPullRequest from '../modules/changelog/models/github-pull-request';

export const isNumber = (item: number | undefined): item is number => {
  return !!item;
};
export const isIssue = (item: GitHubIssue | undefined): item is GitHubIssue => {
  return !!item;
};

export const distinct = (value: any, index: number, self: any[]) => {
  return self.indexOf(value) === index;
};

export const isPullRequest = (
  item: GitHubPullRequest | undefined
): item is GitHubPullRequest => {
  return !!item;
};
