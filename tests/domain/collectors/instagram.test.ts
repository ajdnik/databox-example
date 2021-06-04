import { expect, use } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinonChai from 'sinon-chai';
import { stub } from 'sinon';
import { Container, Configuration } from '../../../src/domain/interfaces';
import { InstagramMetrics } from '../../../src/domain/collectors/instagram';

use(chaiAsPromised);
use(sinonChai);

describe('InstagramMetrics', () => {
  const container: Container = {} as Container;
  let instagram: InstagramMetrics;
  beforeEach(() => {
    container.log = {
      debug: stub(),
      info: stub(),
      warn: stub(),
      error: stub(),
    };
    container.config = {
      instagram: {
        username: 'fake-username',
      },
    } as Configuration;
    container.instagram = {
      getFollowers: stub().resolves(0),
      getFollowings: stub().resolves(0),
      getPhotos: stub().resolves(0),
    };
    instagram = new InstagramMetrics(container);
  });

  it('should return metrics on success', async () => {
    const username = 'fake-username';
    const res = await instagram.collect();

    expect(res).to.deep.eq([
      { key: 'total_followers', value: 0, attributes: { username } },
      { key: 'total_following', value: 0, attributes: { username } },
      { key: 'total_pictures', value: 0, attributes: { username } },
    ]);
  });

  it('should return metrics on success #2', async () => {
    const username = 'fake-username';
    (container.instagram.getFollowers as any).resolves(176);
    (container.instagram.getFollowings as any).resolves(415);
    (container.instagram.getPhotos as any).resolves(17);

    const res = await instagram.collect();

    expect(res).to.deep.eq([
      { key: 'total_followers', value: 176, attributes: { username } },
      { key: 'total_following', value: 415, attributes: { username } },
      { key: 'total_pictures', value: 17, attributes: { username } },
    ]);
  });

  it('should throw error if instagram service call fails', async () => {
    (container.instagram.getFollowings as any).throws(new Error('Get followings error'));

    await expect(instagram.collect()).to.be.rejectedWith('Get followings error');
  });
});
