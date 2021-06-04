import { expect, use } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinonChai from 'sinon-chai';
import { stub } from 'sinon';
import { Container, Configuration } from '../../../src/domain/interfaces';
import { BitbucketMetrics } from '../../../src/domain/collectors/bitbucket';

use(chaiAsPromised);
use(sinonChai);

describe('BitbucketMetrics', () => {
  const container: Container = {} as Container;
  let bitbucket: BitbucketMetrics;
  beforeEach(() => {
    container.log = {
      debug: stub(),
      info: stub(),
      warn: stub(),
      error: stub(),
    };
    container.config = {
      bitbucket: {
        username: 'fake-username',
      },
    } as Configuration;
    container.bitbucket = {
      getRepositories: stub().resolves([]),
    };
    bitbucket = new BitbucketMetrics(container);
  });

  it('should collect a single metric when no repositories found', async () => {
    const owner = 'fake-username';
    const res = await bitbucket.collect();
    expect(res).to.deep.eq([
      { key: 'repositories', value: 0, attributes: { owner }},
    ]);
  });

  it('should throw error if Bitbucket service fails', async () => {
    (container.bitbucket.getRepositories as any).throws(new Error('Get repositories error'));
    await expect(bitbucket.collect()).to.be.rejectedWith('Get repositories error');
  });

  it('should compute language metrics', async () => {
    const owner = 'fake-username';
    (container.bitbucket.getRepositories as any).resolves([
      { name: 'repo1', language: 'c' }, 
      { name: 'repo2', language: '' }, 
      { name: 'repo3', language: 'js' }, 
      { name: 'repo4', language: 'c' }, 
      { name: 'repo5', language: 'js' }, 
      { name: 'repo6', language: 'php' }, 
      { name: 'repo7', language: '' }, 
      { name: 'repo8', language: 'php' }, 
      { name: 'repo9', language: 'php' }, 
    ]);

    const res = await bitbucket.collect();

    expect(res).to.deep.eq([
      { key: 'repositories', value: 9, attributes: { owner }},
      { key: 'languages', value: 2, attributes: { language: 'c' }},
      { key: 'languages', value: 2, attributes: { language: 'unknown' }},
      { key: 'languages', value: 2, attributes: { language: 'js' }},
      { key: 'languages', value: 3, attributes: { language: 'php' }},
    ]);
  });
});
