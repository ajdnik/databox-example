export interface Application {
  execute(): Promise<void>;
}

export namespace GitHub {
  export interface Repository {
    name: string;
  }

  export interface CodeFrequency {
    week: number;
    additions: number;
    deletions: number;
    repository: string;
    username: string;
  }

  export interface CommitActivity {
    week: number;
    days: number[];
    total: number;
    repository: string;
    username: string;
  }

  export interface Service {
    getRepositories(username: string): Promise<Repository[]>;
    getCodeFrequency(username: string, repository: string): Promise<CodeFrequency[]>;
    getCommitActivity(username: string, repository: string): Promise<CommitActivity[]>;
  }
}

export namespace Instagram {
  export interface Service {
    getFollowers(username: string): Promise<number>;
    getFollowings(username: string): Promise<number>;
    getPhotos(username: string): Promise<number>;
  }
}

export namespace Databox {
  export interface Metric {
    key: string;
    value: number;
    date?: string;
    attributes?: {[key: string]: string};
  }

  export interface PushResult {
    id: string;
    metrics: string[];
  } 

  export interface Service {
    push(metrics: Metric[]): Promise<PushResult>;
  }
}

export interface Collector {
  collect(): Promise<Databox.Metric[]>;
}

export interface Logger {
  info(msg: string, meta?: any): void;
  warn(msg: string, meta?: any): void;
  error(msg: string, meta?: any): void;
  debug(msg: string, meta?: any): void;
}

export interface Pipeline {
  collector: Collector;
  databox: Databox.Service;
}

export interface PipelineExecutor {
  (container: Container, pipeline: Pipeline): Promise<void>
}

export interface Timeout {
  wait(ms: number): Promise<void>;
}

export interface Configuration {
  timeout?: number;
  environment: string;
  service: string;
  log: {
    filename: string;
  },
  github: {
    username: string;
    token: string;
    databox: string;
  }
  instagram: {
    username: string;
    password: string;
    databox: string;
  }
}

export interface Container {
  github: GitHub.Service;
  instagram: Instagram.Service;
  config: Configuration;
  pipelines: Pipeline[];
  executor: PipelineExecutor;
  timeout: Timeout;
  log: Logger;
}
