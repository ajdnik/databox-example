import { Container, Pipeline } from './interfaces';

/**
 * Executes a metric collection and metric upload pipeline.
 * 
 * @param container - Dependency injection container.
 * @param pipeline - Metric collection pipeline.
 */
export async function ExecutePipeline(container: Container, pipeline: Pipeline): Promise<void> {
  try {
    const metrics = await pipeline.collector.collect();
    const res = await pipeline.databox.push(metrics);
    container.log.info('KPIs sent to Databox successfully', { pushId: res.id, metrics: res.metrics, kpiCount: metrics.length });
  } catch (err) {
    container.log.error('Problem while sending KIPs to Databox', { error: err.message, stack: err.stack});
  }
}
