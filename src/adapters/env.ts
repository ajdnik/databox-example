import * as dotenv from 'dotenv';

/**
 * Adapter to load environment variables from a .env file.
 * @class
 */
export class EnvAdapter {
  /**
   * Load environment variables from a .env file
   * into the process.env object.
   *
   * @public
   */
  load(): void {
    dotenv.config();
  }
}
