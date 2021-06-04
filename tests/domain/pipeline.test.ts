import { expect, use } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinonChai from 'sinon-chai';
import { stub } from 'sinon';
import { ExecutePipeline } from '../../src/domain/pipeline';
import { Container, Pipeline, Logger, Databox, Collector } from '../../src/domain/interfaces';

use(chaiAsPromised);
use(sinonChai);

describe('ExecutePipeline', () => {
  let container: Container = {} as Container;
  let pipeline: Pipeline = {} as Pipeline;
  beforeEach(() => {
    container.log = {
      info: stub(),
      warn: stub(),
      error: stub(),
      debug: stub(),
    };
    pipeline.collector = {
      collect: stub().resolves([])
    };
    pipeline.databox = {
      push: stub().resolves({ id: 'fake', metrics: [] })
    };
  });

  it('should catch and log error if metric collection fails', async () => {
    (pipeline.collector.collect as any).throws(new Error('Collect test exception'));
    await expect(ExecutePipeline(container, pipeline)).to.not.be.rejected;
    expect(container.log.error).to.be.calledOnce;
  });

  it('should catch and log error if metric upload fails', async () => {
    (pipeline.databox.push as any).throws(new Error('Push test exception'));
    await expect(ExecutePipeline(container, pipeline)).to.not.be.rejected;
    expect(container.log.error).to.be.calledOnce;
  });

  it('should return and log success if pipeline execution completes successfully', async () => {
    await expect(ExecutePipeline(container, pipeline)).to.not.be.rejected;
    expect(container.log.error).to.not.be.called;
    expect(container.log.info).to.be.calledOnce;
  });
});
