import { Collector, Container, Databox, Instagram } from '../interfaces';

/**
 * Conveniance object definition to
 * produce tagged task results.
 * Tagged based on key value.
 */
interface TaskResult {
  key: string;
  value: number;
}

/**
 * Instagram metrics collector implementation.
 * @class
 */
export class InstagramMetrics implements Collector {
  constructor(private container: Container) {}

  /**
   * A conveniance function which converts async results into
   * tagged results.
   *
   * @param key - Task tag.
   * @param result - A promise to be executed.
   * @returns A tagged promise result.
   * @throws
   */
  private async createTask(key: string, result: Promise<number>): Promise<TaskResult> {
    const value = await result;
    return { key, value };
  }

  /**
   * Collect all of the tracked Instagram metrics and
   * convert them into {@link Databox.Metric} format.
   *
   * @returns An array of {@link Databox.Metric}
   * @throws
   */
  async collect(): Promise<Databox.Metric[]> {
    const { username } = this.container.config.instagram;
    const statsTasks = [
      this.createTask('total_followers', this.container.instagram.getFollowers(username)),
      this.createTask('total_following', this.container.instagram.getFollowings(username)),
      this.createTask('total_pictures', this.container.instagram.getPhotos(username)),
    ];

    const results = await Promise.all(statsTasks);
    const metrics = results.map(
      ({ key, value }: TaskResult) =>
        ({
          key,
          value,
          attributes: {
            username,
          },
        } as Databox.Metric),
    );
    this.container.log.debug('Collected metrics from Instagram service', { metricCount: metrics.length });
    return metrics;
  }
}
