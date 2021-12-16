import { Octokit } from '@octokit/rest';
import chalk from 'chalk';
import { Endpoints } from '@octokit/types';
import GitHubIssue from '../modules/changelog/models/github-issue';
import GitHubPullRequest from '../modules/changelog/models/github-pull-request';

type GithubIssueRequest =
  Endpoints['GET /repos/{owner}/{repo}/issues/{issue_number}']['response'];
type GithubPrRequest =
  Endpoints['GET /repos/{owner}/{repo}/pulls/{pull_number}']['response'];

class GitHub {
  private readonly _octokit: Octokit;
  constructor() {
    this._octokit = new Octokit();
  }
  getRepoParts(repo: string) {
    const parts = repo.split('/');
    return {
      owner: parts[0],
      repo: parts[1]
    };
  }
  async getIssues(id: number, repo: string): Promise<GitHubIssue | undefined> {
    console.log(`ℹ️  Loading issue with number ${chalk.cyan(id)} from GitHub`);

    try {
      const repos = this.getRepoParts(repo);
      const res: GithubIssueRequest = await this._octokit.rest.issues.get({
        issue_number: id,
        repo: repos.repo,
        owner: repos.owner
      });

      if (res.status === 200) {
        const data = res.data;
        return {
          id: data.id,
          number: data.number,
          submitter: data.user?.login,
          title: data.title,
          url: data.html_url
        };
      }
    } catch (error) {
      const err = error as any;
      if (err?.status) {
        if (err.status === 404) {
          console.log(
            chalk.redBright(`❌ Failed to find issue with number: ${id}`)
          );
        }
      }
    }

    return undefined;
  }
  async getPullRequests(
    id: number,
    repo: string
  ): Promise<GitHubPullRequest | undefined> {
    console.log(`ℹ️ Loading pull request ${chalk.cyan(id)} from GitHub`);

    try {
      const repos = this.getRepoParts(repo);
      const res: GithubPrRequest = await this._octokit.rest.pulls.get({
        pull_number: id,
        repo: repos.repo,
        owner: repos.owner
      });

      if (res.status === 200) {
        const data = res.data;
        return {
          id: data.id,
          number: data.number,
          submitter: data.user?.login,
          title: data.title,
          url: data.html_url
        };
      }
    } catch (error) {
      const err = error as any;
      if (err?.status) {
        if (err.status === 404) {
          console.log(
            chalk.redBright(`Failed to find pull request with number: ${id}`)
          );
        }
      }
    }

    return undefined;
  }
}
export default GitHub;
