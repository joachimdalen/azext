export default interface GitHubPullRequest {
  id: number;
  number: number;
  title: string;
  url: string;
  submitter?: string;
}
