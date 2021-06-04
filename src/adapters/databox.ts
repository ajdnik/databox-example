import { Databox as Interface } from '../domain/interfaces';
import * as Databox from 'databox';

/**
 * Databox service implementation using the standard
 * databox nodejs library.
 * @class
 */
export class DataboxAdapter implements Interface.Service {
  private client: Databox;
  constructor(token: string) {
    this.client = new Databox({ push_token: token });
  }

  /**
   * Push metrics to databox servers if there's an error
   * throw it, otherwise return results.
   *
   * @param metrics - An array of metric to be sent to databox.
   * @returns A result containing the operation id and a list of metrics updated.
   * @public
   */
  push(metrics: Interface.Metric[]): Promise<Interface.PushResult> {
    return new Promise<Interface.PushResult>((resolve, reject) => {
      this.client.insertAll(metrics, (res: Databox.Result) => {
        if (res.message) {
          return reject(new Error(res.message as string));
        }
        if (res.errors && res.errors.length > 0) {
          return reject(new Error(res.errors[0].message));
        }
        resolve({
          id: res.id,
          metrics: res.metrics,
        });
      });
    });
  }
}
