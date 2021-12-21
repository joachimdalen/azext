import ChangelogConfig from './changelog-config';
import GitHubIssue from './github-issue';
import GitHubPullRequest from './github-pull-request';

export default interface GeneratorContext {
  config: ChangelogConfig;
  issues: Map<number, GitHubIssue>;
  pullRequests: Map<number, GitHubPullRequest>;
  types: string[];
}
