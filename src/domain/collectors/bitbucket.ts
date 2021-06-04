import { Collector, Container, Databox, Bitbucket } from '../interfaces';

/**
 * Collect Bitbucket metrics to send to Databox service.
 * @class
 */
export class BitbucketMetrics implements Collector {
  constructor(private container: Container) {}

  /**
   * Collect and compute metrics from Bitbucket service.
   *
   * @returns An array of {@link Databox.Metric}
   * @public
   */
  async collect(): Promise<Databox.Metric[]> {
    const repos = await this.container.bitbucket.getRepositories();
    let metrics: Databox.Metric[] = [
      {
        key: 'repositories',
        value: repos.length,
        attributes: {
          owner: this.container.config.bitbucket.username, 
        }
      }
    ];

    const languageCounts = repos.reduce((counts: {[key: string]: number}, repo: Bitbucket.Repository) => {
      if (!counts.hasOwnProperty(repo.language)) {
        counts[repo.language] = 0;
      }
      counts[repo.language] += 1;
      return counts;
    }, {});
    metrics = metrics.concat(Object.entries(languageCounts).map((val: [string, number]) => ({
      key: 'languages',
      value: val[1],
      attributes: {
        language: val[0] === '' ? 'unknown': val[0],
      }
    } as Databox.Metric)));

    this.container.log.debug('Collected metrics from Bitbucket service', { metricCount: metrics.length});
    return metrics;
  }
}
