import { Bitbucket as Interface } from '../domain/interfaces';
import * as Bitbucket from 'bitbucketjs';

/**
 * Implementation of Bitbucket service using the
 * bitbucketjs library.
 * @class
 */
export class BitbucketAdapter implements Interface.Service {
  private client: Bitbucket;
  constructor(private username: string, password: string) {
    this.client = new Bitbucket({ username, password });
  }

  /**
   * Return an array of repositories the user is
   * allowed to access.
   *
   * @returns An array of repositories.
   * @throws
   */
  async getRepositories(): Promise<Interface.Repository[]> {
    const teams = await this.client.team.mine();
    const teamNames = teams.values.map((itm: any) => itm.username);
    teamNames.push(this.username);

    const repoTasks = teamNames.map((owner: string) => this.client.repo.forOwner(owner));
    const results = await Promise.all(repoTasks);
  
    const repos = results.reduce((acc: any[], itm: any) => acc.concat(itm.values), []);
    return (repos as any[]).map((itm: any) => ({
      name: itm.name,
      language: itm.language,
    } as Interface.Repository));
  }
} 
