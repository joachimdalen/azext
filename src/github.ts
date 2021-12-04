import { Octokit } from "@octokit/rest";
import messages from "./messages";
class GitHub {
  getIssues(ids: number[]) {
    messages.loadingIssues(ids.length);
    const octokit = new Octokit();
    octokit.rest.issues.get({}).then(({ data }) => {
      // handle data
    });
  }
  getPullRequests(ids: number[]) {}
}
export default GitHub;
