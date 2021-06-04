import { expect, use } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinonChai from 'sinon-chai';
import { stub } from 'sinon';
import { Periodic } from '../../../src/domain/applications/periodic';
import { Container, Pipeline } from '../../../src/domain/interfaces';

use(chaiAsPromised);
use(sinonChai);

describe('Periodic', () => {
  const container: Container = {} as Container;
  let periodic: Periodic;
  beforeEach(() => {
    container.pipelines = [{} as Pipeline];
    container.executor = stub();
    container.timeout = {
      wait: stub().onCall(2).throws(new Error('Break loop')),
    };
    periodic = new Periodic(container, 1234);
  });

  it('should execute a pipeline successfully', async () => {
    await expect(periodic.execute()).to.be.rejectedWith('Break loop');
    expect(container.executor).to.have.callCount(3);
    expect(container.timeout.wait).to.have.callCount(3);
  });

  it('should not execute anything when no pipelines defined', async () => {
    container.pipelines = [];
    await expect(periodic.execute()).to.be.rejectedWith('Break loop');
    expect(container.executor).to.not.be.called;
    expect(container.timeout.wait).to.have.callCount(3);
  });

  it('should throw error if pipeline execution fails', async () => {
    (container.executor as any).throws(new Error('Executor test error'));
    await expect(periodic.execute()).to.be.rejectedWith('Executor test error');
    expect(container.timeout.wait).to.not.be.called;
  });

  it('should execute all pipelines', async () => {
    container.pipelines = container.pipelines.concat([{} as Pipeline, {} as Pipeline, {} as Pipeline]);
    await expect(periodic.execute()).to.be.rejectedWith('Break loop');
    expect(container.executor).to.have.callCount(12);
  });

  it('should throw error if any of the pipelines fails', async () => {
    container.pipelines = container.pipelines.concat([{} as Pipeline, {} as Pipeline, {} as Pipeline, {} as Pipeline]);
    (container.executor as any).onCall(12).throws(new Error('Executor test error'));
    await expect(periodic.execute()).to.be.rejectedWith('Executor test error');
    expect(container.executor).to.be.called;
    expect(container.timeout.wait).to.be.calledTwice;
  });
});
