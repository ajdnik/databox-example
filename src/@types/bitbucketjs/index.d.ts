declare module 'bitbucketjs' {
  interface RepoFunctions {
    forOwner(owner: string): Promise<any>;
  }

  interface TeamFunctions {
    mine(role?: string): Promise<any>;
  }

  class Bitbucket {
    constructor(config: Bitbucket.Config);
    repo: RepoFunctions;
    team: TeamFunctions;
  }

  namespace Bitbucket {
    interface Config {
      username: string;
      password: string;
    }
  }
  export = Bitbucket;
}
