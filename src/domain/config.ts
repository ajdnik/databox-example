import { Configuration } from './interfaces';

/**
 * Return an environment variable, if it is 
 * undefined throw and error.
 *
 * @param name - ENV variable name.
 * @returns ENV variable value.
 * @throws
 */
function requiredString(name: string): string {
  if (!process.env[name]) {
    throw new Error(`Missing env variable ${name}.`);
  }
  return process.env[name] as string;
}

/**
 * Parse environment variable into a number. If the
 * parsing fails it throws and error.
 *
 * @param name - ENV variable name.
 * @returns A number parsed from ENV variable or undefined.
 * @throws
 */
function optionalNumber(name: string): number | undefined {
  if (!process.env[name]) {
    return undefined;
  }
  const parsed = parseInt(process.env[name], 10);
  if (isNaN(parsed)) {
    throw new Error(`Env variable ${name} is not a number.`);
  }
  return parsed as number;
}

/**
 * Generate configuration object based on
 * environment variables.
 *
 * @returns Configuration object.
 */
export function ParseEnvConfig(): Configuration {
  const config: Configuration = {
    timeout: optionalNumber('TIMEOUT'),
    environment: process.env.NODE_ENV || 'production',
    service: process.env.SERVICE || 'databox-example',
    log: {
      filename: process.env.LOG_FILENAME || 'databox.log',
    },
    github: {
      username: requiredString('GITHUB_USERNAME'),
      token: requiredString('GITHUB_TOKEN'),
      databox: requiredString('GITHUB_DATABOX_TOKEN'),
    },
    instagram: {
      username: requiredString('INSTAGRAM_USERNAME'),
      password: requiredString('INSTAGRAM_PASSWORD'),
      databox: requiredString('INSTAGRAM_DATABOX_TOKEN'),
    }
  };
  return config;
}
