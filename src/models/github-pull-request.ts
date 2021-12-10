export default interface GitHubPullRequest {
  id: number;
  number: number;
  title: string;
  url: string;
  sumitter?: string;
}
