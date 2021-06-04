import { Application, Container } from './interfaces';
import { Periodic } from './applications/periodic';
import { Once } from './applications/once';

/**
 * Generate application instance based on environment variables.
 *
 * @param container - Dependency injection container instance.
 * @returns Application instance.
 */
export function AppFactory(container: Container): Application {
  const { config } = container;
  if (config.timeout) {
    return new Periodic(container, config.timeout);
  }
  return new Once(container);
}
