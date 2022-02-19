import ChangelogDefinition from '../modules/changelog/models/changelog-definition';
import GitHubIssue from '../modules/changelog/models/github-issue';
import GitHubPullRequest from '../modules/changelog/models/github-pull-request';

export const isNumber = (item: number | undefined): item is number => {
  return !!item;
};

export const isIssue = (item: GitHubIssue | undefined): item is GitHubIssue => {
  return !!item;
};

export const distinct = <T>(value: T, index: number, self: T[]) => {
  return self.indexOf(value) === index;
};

export const isPullRequest = (
  item: GitHubPullRequest | undefined
): item is GitHubPullRequest => {
  return !!item;
};

export const getChangesForDefinition = (def: ChangelogDefinition) => {
  const moduleChanges = def.modules?.flatMap((x) => x.changes);

  if (def.changes) {
    if (moduleChanges) return [...def.changes, ...moduleChanges];
    return [...def.changes];
  }

  if (moduleChanges !== undefined) return moduleChanges;

  return [];
};
export const getChangesForAllDefinition = (def: ChangelogDefinition[]) => {
  return def.flatMap((x) => getChangesForDefinition(x));
};
