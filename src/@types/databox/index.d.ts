declare module 'databox' {
  class Databox {
    constructor(config: Databox.Config);
    insertAll(kpis: Databox.KPI[], callback: (res: Databox.Result) => void): void;
  }
  namespace Databox {
    interface Config {
      push_token: string;
    }

    interface KPI {
      key: string;
      value: number;
      date?: string;
      attributes?: { [key: string]: string };
    }

    interface Error {
      message: string;
    }

    interface Result {
      id: string;
      metrics: string[];
      message?: string;
      errors: Error[];
    }
  }
  export = Databox;
}
