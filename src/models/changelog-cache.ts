import GitHubIssue from './github-issue';
import GitHubPullRequest from './github-pull-request';

export default interface ChangelogCache {
  issues?: GitHubIssue[];
  pullRequests?: GitHubPullRequest[];
}
