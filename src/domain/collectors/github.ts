import { Collector, Container, Databox, GitHub } from '../interfaces';

/**
 * Collect GitHub metrics to send to Databox service.
 * @class
 */
export class GitHubMetrics implements Collector {
  constructor(private container: Container) {}

  /**
   * Collect code frequency metrics for a specific repository.
   * Only return code frequency stats for the latest 10 weeks.
   *
   * @param username - GitHub username.
   * @param repository - Repository name.
   * @returns An array of {@link Databox.Metric}
   */
  private async collectCodeFrequency(username: string, repository: string): Promise<Databox.Metric[]> {
    const res = await this.container.github.getCodeFrequency(username, repository);
    res.sort((a, b) => (a.week > b.week ? -1 : 1));
    this.container.log.debug('Retrieved code frequency stats from GitHub service', { statsCount: res.length });
    return res.splice(0, 10).reduce(
      (metrics: Databox.Metric[], data: GitHub.CodeFrequency) =>
        metrics.concat([
          {
            key: 'repository_additions',
            value: data.additions,
            date: new Date(data.week * 1000).toISOString(),
            attributes: {
              owner: data.username,
            },
          },
          {
            key: 'repository_deletions',
            value: data.deletions,
            date: new Date(data.week * 1000).toISOString(),
            attributes: {
              owner: data.username,
            },
          },
        ]),
      [],
    );
  }

  /**
   * Collect commit activity metrics for a specific repository.
   * Only return commit activity stats for the last 10 weeks.
   *
   * @param username - GitHub username.
   * @param repository - Repository name.
   * @returns An array of {@link Databox.Metric}
   */
  private async collectCommitActivity(username: string, repository: string): Promise<Databox.Metric[]> {
    const res = await this.container.github.getCommitActivity(username, repository);
    res.sort((a, b) => (a.week > b.week ? -1 : 1));
    this.container.log.debug('Retrieved commit activity stats from GitHub service', { statsCount: res.length });
    return res.splice(0, 10).map(
      (data: GitHub.CommitActivity) =>
        ({
          key: 'repository_commits',
          value: data.total,
          date: new Date(data.week * 1000).toISOString(),
          attributes: {
            owner: data.username,
          },
        } as Databox.Metric),
    );
  }

  /**
   * Collect and aggregate all GitHub metrics that
   * can be sent to Databox service.
   *
   * @returns An array of {@link Databox.Metric}
   * @public
   */
  async collect(): Promise<Databox.Metric[]> {
    let metrics: Databox.Metric[] = [];
    const { username } = this.container.config.github;
    const repos = await this.container.github.getRepositories(username);
    metrics.push({
      key: 'repositories',
      value: repos.length,
      attributes: {
        owner: username,
      },
    });

    const metricTasks = repos.reduce((tasks, repo) => {
      tasks.push(this.collectCodeFrequency(username, repo.name));
      tasks.push(this.collectCommitActivity(username, repo.name));
      return tasks;
    }, []);
    const results = await Promise.all(metricTasks);

    // Combine metrics collected per repository into a commulative metric that is per user
    const combined = results.reduce((acc: { [key: string]: Databox.Metric }, res: Databox.Metric[]) => {
      res.forEach((itm: Databox.Metric) => {
        const key = `${itm.key}_${itm.date}`;
        if (!acc.hasOwnProperty(key)) {
          acc[key] = itm;
        } else {
          acc[key].value += itm.value;
        }
      });
      return acc;
    }, {});
    metrics = metrics.concat(Object.values(combined));
    this.container.log.debug('Collected metrics from GitHub service', { metricCount: metrics.length });
    return metrics;
  }
}
