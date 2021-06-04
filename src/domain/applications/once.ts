import { Application, Container, Pipeline } from '../interfaces';

/**
 * Implements a single shot application strategy, where
 * the application is ran once and then the process exits.
 * @class
 */
export class Once implements Application {
  constructor(private container: Container) {}

  /**
   * Execute application strategy, to run all
   * metric collection pipelines concurrently then exit.
   * @public
   */
  async execute(): Promise<void> {
    const pipelineTasks = this.container.pipelines.map((pipeline: Pipeline) =>
      this.container.executor(this.container, pipeline),
    );
    await Promise.all(pipelineTasks);
  }
}
