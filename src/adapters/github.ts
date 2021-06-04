import { GitHub } from '../domain/interfaces';
import { Octokit } from '@octokit/rest';

/**
 * Implementation of GitHub service using the standard
 * octokit nodejs library.
 * @class
 */
export class GitHubAdapter implements GitHub.Service {
  private octokit: any;

  constructor(accessToken: string) {
    this.octokit = new Octokit({ auth: accessToken });
  }

  /**
   * Get a list of repositoryes the service is authorized to retrieve.
   *
   * @param username - GitHub username.
   * @returns An array of {@link GitHub.Repository}
   * @throws
   * @public
   */
  async getRepositories(username: string): Promise<GitHub.Repository[]> {
    const res = await this.octokit.request('GET /users/{username}/repos', { username });
    return res.data.map(
      (itm: any) =>
        ({
          name: itm.name,
        } as GitHub.Repository),
    );
  }

  /**
   * Get code frequency stats for a repository.
   *
   * @param username - GitHub username.
   * @param repository - Repository name.
   * @returns An array of {@link GitHub.CodeFrequency}
   * @throws
   * @public
   */
  async getCodeFrequency(username: string, repository: string): Promise<GitHub.CodeFrequency[]> {
    const res = await this.octokit.request('GET /repos/{owner}/{repo}/stats/code_frequency', {
      owner: username,
      repo: repository,
    });
    if (res.status !== 200) {
      return [];
    }
    return res.data.map(
      (itm: any) =>
        ({
          week: itm[0],
          additions: itm[1],
          deletions: itm[2],
          repository,
          username,
        } as GitHub.CodeFrequency),
    );
  }

  /**
   * Get commit activity stats for a repository.
   *
   * @param username - GitHub username.
   * @param repository - Repository name.
   * @returns An array of {@link GitHub.CommitActivity}
   * @throws
   * @public
   */
  async getCommitActivity(username: string, repository: string): Promise<GitHub.CommitActivity[]> {
    const res = await this.octokit.request('GET /repos/{owner}/{repo}/stats/commit_activity', {
      owner: username,
      repo: repository,
    });
    if (res.status !== 200) {
      return [];
    }
    return res.data.map(
      (itm: any) =>
        ({
          week: itm.week,
          days: itm.days,
          total: itm.total,
          repository,
          username,
        } as GitHub.CommitActivity),
    );
  }
}
