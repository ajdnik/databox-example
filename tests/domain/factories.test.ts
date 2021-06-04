import { expect, use } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinonChai from 'sinon-chai';
import { stub } from 'sinon';
import { Container, Configuration, Pipeline } from '../../src/domain/interfaces';
import { AppFactory } from '../../src/domain/factories';

use(chaiAsPromised);
use(sinonChai);

describe('AppFactory', () => {
  const container: Container = {} as Container;
  beforeEach(() => {
    container.config = {} as Configuration;
    container.pipelines = [{} as Pipeline];
    container.executor = stub();
    container.timeout = {
      wait: stub().throws(new Error('Break loop')),
    };
  });

  it('should create a Periodic instance if timeout is defined', async () => {
    container.config.timeout = 1234;
    const res = AppFactory(container);
    await expect(res.execute()).to.be.rejectedWith('Break loop');
  });

  it('should create a Once instance if timeout is not defined', async () => {
    const res = AppFactory(container);
    await expect(res.execute()).to.not.be.rejected;
  });
});
