export default interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  url: string;
  submitter?: string;
}
