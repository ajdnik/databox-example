import { Timeout } from '../domain/interfaces';

/**
 * Abstract setTimeout logic to simplify
 * testability of code.
 * @class
 */
export class SetTimeout implements Timeout {
  /**
   * Wait for a defined period of time before continuing execution.
   *
   * @param ms - Milliseconds to wait.
   * @public
   */
  async wait(ms: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, ms));
  }
}
