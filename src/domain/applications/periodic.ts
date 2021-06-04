import { Application, Container, Pipeline } from '../interfaces';

/**
 * Implements a periodic execution application strategy,
 * where the application runs its logic every period.
 * @class
 */
export class Periodic implements Application {
  constructor(private container: Container, private timeoutMs: number) {}

  /**
   * Execute application strategy, to run all
   * metric collection pipelines concurrently then wait for a period,
   * and then rerun the pipelines again, and so forth.
   * @public
   */
  async execute(): Promise<void> {
    for (;;) {
      const pipelineTasks = this.container.pipelines.map((pipeline: Pipeline) =>
        this.container.executor(this.container, pipeline),
      );
      await Promise.all(pipelineTasks);
      await this.container.timeout.wait(this.timeoutMs);
    }
  }
}
