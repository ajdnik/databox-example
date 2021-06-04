import { AppFactory } from './domain/factories';
import { Container } from './domain/interfaces';
import { SetTimeout } from './adapters/timeout';
import { GitHubMetrics } from './domain/collectors/github';
import { InstagramMetrics } from './domain/collectors/instagram';
import { GitHubAdapter } from './adapters/github';
import { DataboxAdapter } from './adapters/databox';
import { InstagramAdapter } from './adapters/instagram';
import { ParseEnvConfig } from './domain/config';
import { WinstonAdapter } from './adapters/winston';
import { ExecutePipeline } from './domain/pipeline';
import { EnvAdapter } from './adapters/env';

// Load configuration
const env = new EnvAdapter();
env.load();
const config = ParseEnvConfig();

// Build a dependency injection container
const container = {} as Container;
container.config = config;
container.timeout = new SetTimeout();
container.github = new GitHubAdapter(config.github.token);
container.instagram = new InstagramAdapter(config.instagram.username, config.instagram.password);
container.log = new WinstonAdapter(config.environment, config.service, config.log.filename);
container.executor = ExecutePipeline;
container.pipelines = [
  {
    collector: new GitHubMetrics(container),
    databox: new DataboxAdapter(config.github.databox),
  },
  {
    collector: new InstagramMetrics(container),
    databox: new DataboxAdapter(config.instagram.databox),
  },
];

// Define process handlers
process.on('SIGTERM', () => {
  container.log.info(`Process ${process.pid} received a SIGTERM signal`);
  process.exit(0);
});

process.on('SIGINT', () => {
  container.log.info(`Process ${process.pid} has been interrupted`);
  process.exit(0);
});

process.on('uncaughtException', (err) => {
  container.log.error('Uncaught exception, exiting process', { error: err.message, stack: err.stack });
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  container.log.error('Unhandled rejection, exiting process', { reason, promise });
  process.exit(1);
});

// Start application
const app = AppFactory(container);
app.execute();
