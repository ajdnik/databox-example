import { expect, use } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinonChai from 'sinon-chai';
import { stub } from 'sinon';
import { Once } from '../../../src/domain/applications/once';
import { Container, Pipeline } from '../../../src/domain/interfaces';

use(chaiAsPromised);
use(sinonChai);

describe('Once', () => {
  let container: Container = {} as Container;
  let once: Once;
  beforeEach(() => {
    container.pipelines = [
      {} as Pipeline,
    ];
    container.executor = stub();
    once = new Once(container);
  });

  it('should execute a pipeline successfully', async () => {
    await expect(once.execute()).to.not.be.rejected;
    expect(container.executor).to.be.calledOnce;
  });

  it('should not execute anything when no pipelines defined', async () => {
    container.pipelines = [];
    await expect(once.execute()).to.not.be.rejected;
    expect(container.executor).to.not.be.called;
  });

  it('should throw error if pipeline execution fails', async () => {
    (container.executor as any).throws(new Error('Executor test error'));
    await expect(once.execute()).to.be.rejectedWith('Executor test error');
  });

  it('should execute all pipelines', async () => {
    container.pipelines = container.pipelines.concat([
      {} as Pipeline,
      {} as Pipeline,
      {} as Pipeline
    ]);
    await expect(once.execute()).to.not.be.rejected;
    expect(container.executor).to.have.callCount(4);
  });

  it('should throw error if any of the pipelines fails', async () => {
    container.pipelines = container.pipelines.concat([
      {} as Pipeline,
      {} as Pipeline,
      {} as Pipeline,
      {} as Pipeline
    ]);
    (container.executor as any).onCall(2).throws(new Error('Executor test error'));
    await expect(once.execute()).to.be.rejectedWith('Executor test error');
    expect(container.executor).to.be.called;
  });
});
