import { expect, use } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinonChai from 'sinon-chai';
import { stub } from 'sinon';
import { Container, Configuration } from '../../../src/domain/interfaces';
import { GitHubMetrics } from '../../../src/domain/collectors/github';

use(chaiAsPromised);
use(sinonChai);

describe('GitHubMetrics', () => {
  let container: Container = {} as Container;
  let github: GitHubMetrics;
  beforeEach(() => {
    container.log = {
      debug: stub(),
      info: stub(),
      warn: stub(),
      error: stub(),
    };
    container.config = {
      github: {
        username: 'fake-username',
      }
    } as Configuration;
    container.github = {
      getRepositories: stub().resolves([]),
      getCodeFrequency: stub().resolves([]),
      getCommitActivity: stub().resolves([]),
    }
    github = new GitHubMetrics(container);
  });

  it('should throw error if github service call fails', async () => {
    (container.github.getRepositories as any).resolves([{ name: 'fake-repo' }]);
    (container.github.getCodeFrequency as any).throws(new Error('Get code frequency error'));

    await expect(github.collect()).to.be.rejectedWith('Get code frequency error');
  });

  it('should return a single metric when service returns nothing', async () => {
    const res = await github.collect();
    expect(res).to.deep.eq([{
      key: 'repositories',
      value: 0,
      attributes: {
        owner: 'fake-username',
      }
    }]);
  });

  it('should return metrics when service returns data', async () => {
    const date = new Date(13 * 1000).toISOString();
    const owner = 'fake-username';
    (container.github.getRepositories as any).resolves([{ name: 'fake-repo' }]);
    (container.github.getCodeFrequency as any).resolves([
      { week: 13, additions: 17, deletions: -117, username: owner },
    ]);
    (container.github.getCommitActivity as any).resolves([
      { week: 13, total: 11, username: owner },
    ]);

    const res = await github.collect();

    expect(res).to.deep.eq([
      { key: 'repositories', value: 1, attributes: { owner }},
      { key: 'repository_additions', value: 17, date, attributes: { owner }},
      { key: 'repository_deletions', value: -117, date, attributes: { owner }},
      { key: 'repository_commits', value: 11, date, attributes: { owner }},
    ]);
  });

  it('should return 10 latest weeks of stats per repository', async () => {
    const date = (val: number) => new Date(val * 1000).toISOString();
    const owner = 'fake-username';
    (container.github.getRepositories as any).resolves([{ name: 'fake-repo' }]);
    (container.github.getCodeFrequency as any).resolves([
      { week: 13, additions: 17, deletions: 0, username: owner },
      { week: 10, additions: 18, deletions: -117, username: owner },
      { week: 115, additions: 127, deletions: -1, username: owner },
      { week: 1, additions: 117, deletions: -11, username: owner },
      { week: 12, additions: 179, deletions: -17, username: owner },
      { week: 3, additions: 74, deletions: -7, username: owner },
      { week: 25, additions: 17, deletions: -91, username: owner },
      { week: 7, additions: 17, deletions: -13, username: owner },
      { week: 111, additions: 113, deletions: 0, username: owner },
      { week: 292, additions: 0, deletions: 0, username: owner },
      { week: 9, additions: 0, deletions: -117, username: owner },
      { week: 90, additions: 15, deletions: -1, username: owner },
      { week: 4, additions: 1, deletions: -17, username: owner },
    ]);
    (container.github.getCommitActivity as any).resolves([
      { week: 13, total: 11, username: owner },
      { week: 12, total: 0, username: owner },
      { week: 11, total: 112, username: owner },
      { week: 10, total: 151, username: owner },
      { week: 4, total: 311, username: owner },
      { week: 130, total: 1, username: owner },
      { week: 143, total: 0, username: owner },
      { week: 19, total: 18, username: owner },
      { week: 3, total: 10, username: owner },
      { week: 292, total: 13, username: owner },
      { week: 113, total: 13, username: owner },
      { week: 213, total: 0, username: owner },
      { week: 7, total: 0, username: owner },
      { week: 17, total: 0, username: owner },
      { week: 8, total: 11, username: owner },
    ]);

    const res = await github.collect();

    expect(res).to.deep.eq([
      { key: 'repositories', value: 1, attributes: { owner }},
      { key: 'repository_additions', value: 0, date: date(292), attributes: { owner }},
      { key: 'repository_deletions', value: 0, date: date(292), attributes: { owner }},
      { key: 'repository_additions', value: 127, date: date(115), attributes: { owner }},
      { key: 'repository_deletions', value: -1, date: date(115), attributes: { owner }},
      { key: 'repository_additions', value: 113, date: date(111), attributes: { owner }},
      { key: 'repository_deletions', value: 0, date: date(111), attributes: { owner }},
      { key: 'repository_additions', value: 15, date: date(90), attributes: { owner }},
      { key: 'repository_deletions', value: -1, date: date(90), attributes: { owner }},
      { key: 'repository_additions', value: 17, date: date(25), attributes: { owner }},
      { key: 'repository_deletions', value: -91, date: date(25), attributes: { owner }},
      { key: 'repository_additions', value: 17, date: date(13), attributes: { owner }},
      { key: 'repository_deletions', value: 0, date: date(13), attributes: { owner }},
      { key: 'repository_additions', value: 179, date: date(12), attributes: { owner }},
      { key: 'repository_deletions', value: -17, date: date(12), attributes: { owner }},
      { key: 'repository_additions', value: 18, date: date(10), attributes: { owner }},
      { key: 'repository_deletions', value: -117, date: date(10), attributes: { owner }},
      { key: 'repository_additions', value: 0, date: date(9), attributes: { owner }},
      { key: 'repository_deletions', value: -117, date: date(9), attributes: { owner }},
      { key: 'repository_additions', value: 17, date: date(7), attributes: { owner }},
      { key: 'repository_deletions', value: -13, date: date(7), attributes: { owner }},
      { key: 'repository_commits', value: 13, date: date(292), attributes: { owner }},
      { key: 'repository_commits', value: 0, date: date(213), attributes: { owner }},
      { key: 'repository_commits', value: 0, date: date(143), attributes: { owner }},
      { key: 'repository_commits', value: 1, date: date(130), attributes: { owner }},
      { key: 'repository_commits', value: 13, date: date(113), attributes: { owner }},
      { key: 'repository_commits', value: 18, date: date(19), attributes: { owner }},
      { key: 'repository_commits', value: 0, date: date(17), attributes: { owner }},
      { key: 'repository_commits', value: 11, date: date(13), attributes: { owner }},
      { key: 'repository_commits', value: 0, date: date(12), attributes: { owner }},
      { key: 'repository_commits', value: 112, date: date(11), attributes: { owner }},
    ]);
  });

  it('should combine stats across all repositories', async () => {
    const date = (val: number) => new Date(val * 1000).toISOString();
    const owner = 'fake-username';
    (container.github.getRepositories as any).resolves([
      { name: 'fake-repo-one' },
      { name: 'fake-repo-two' },
      { name: 'fake-repo-three' },
    ]);
    (container.github.getCodeFrequency as any).onCall(0).resolves([
      { week: 13, additions: 17, deletions: 0, username: owner },
      { week: 113, additions: 117, deletions: -12, username: owner },
      { week: 3, additions: 0, deletions: -199, username: owner },
      { week: 1, additions: 197, deletions: 0, username: owner },
    ]);
    (container.github.getCodeFrequency as any).onCall(1).resolves([
      { week: 13, additions: 1, deletions: -12, username: owner },
      { week: 113, additions: 74, deletions: 0, username: owner },
      { week: 7, additions: 281, deletions: 0, username: owner },
    ]);
    (container.github.getCodeFrequency as any).onCall(2).resolves([
      { week: 13, additions: 0, deletions: -112, username: owner },
      { week: 3, additions: 189, deletions: 0, username: owner },
      { week: 7, additions: 233, deletions: 0, username: owner },
      { week: 12, additions: 719, deletions: -41, username: owner },
      { week: 17, additions: 17, deletions: -93, username: owner },
    ]);
    (container.github.getCommitActivity as any).onCall(0).resolves([
      { week: 13, total: 0, username: owner },
      { week: 142, total: 178, username: owner },
      { week: 1, total: 311, username: owner },
    ]);
    (container.github.getCommitActivity as any).onCall(1).resolves([]);
    (container.github.getCommitActivity as any).onCall(2).resolves([
      { week: 14, total: 17, username: owner },
      { week: 142, total: 11, username: owner },
      { week: 1, total: 8, username: owner },
      { week: 7, total: 0, username: owner },
    ]);

    const res = await github.collect();

    expect(res).to.deep.eq([
      { key: 'repositories', value: 3, attributes: { owner }},
      { key: 'repository_additions', value: 191, date: date(113), attributes: { owner }},
      { key: 'repository_deletions', value: -12, date: date(113), attributes: { owner }},
      { key: 'repository_additions', value: 18, date: date(13), attributes: { owner }},
      { key: 'repository_deletions', value: -124, date: date(13), attributes: { owner }},
      { key: 'repository_additions', value: 189, date: date(3), attributes: { owner }},
      { key: 'repository_deletions', value: -199, date: date(3), attributes: { owner }},
      { key: 'repository_additions', value: 197, date: date(1), attributes: { owner }},
      { key: 'repository_deletions', value: 0, date: date(1), attributes: { owner }},
      { key: 'repository_commits', value: 189, date: date(142), attributes: { owner }},
      { key: 'repository_commits', value: 0, date: date(13), attributes: { owner }},
      { key: 'repository_commits', value: 319, date: date(1), attributes: { owner }},
      { key: 'repository_additions', value: 514, date: date(7), attributes: { owner }},
      { key: 'repository_deletions', value: 0, date: date(7), attributes: { owner }},
      { key: 'repository_additions', value: 17, date: date(17), attributes: { owner }},
      { key: 'repository_deletions', value: -93, date: date(17), attributes: { owner }},
      { key: 'repository_additions', value: 719, date: date(12), attributes: { owner }},
      { key: 'repository_deletions', value: -41, date: date(12), attributes: { owner }},
      { key: 'repository_commits', value: 17, date: date(14), attributes: { owner }},
      { key: 'repository_commits', value: 0, date: date(7), attributes: { owner }},
    ]);
  });
});
