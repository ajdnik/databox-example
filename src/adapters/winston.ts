import { Logger } from '../domain/interfaces';
import * as winston from 'winston';

/**
 * Implementation of the Logger interface using the
 * winston logging library.
 * @class
 */
export class WinstonAdapter implements Logger {
  private logger: winston.Logger;
  constructor(env: string, service: string, filename: string) {
    const context = winston.format((info) => {
      info.service = service;
      return info;
    });

    const transports: winston.transport[] = [new winston.transports.Console()];
    if (env !== 'development') {
      transports.push(new winston.transports.File({ filename }));
    }

    this.logger = winston.createLogger({
      level: env === 'development' ? 'debug' : 'info',
      format: winston.format.combine(winston.format.timestamp(), context(), winston.format.json()),
      transports,
    });
  }

  /**
   * Log an info level message.
   *
   * @param message - Message to log.
   * @param meta - Additional metadata to append to logs.
   */
  info(message: string, meta?: any): void {
    this.logger.info(message, meta);
  }

  /**
   * Log a warning level message.
   *
   * @param message - Message to log.
   * @param meta - Additional metadata to append to logs.
   */
  warn(message: string, meta?: any): void {
    this.logger.warn(message, meta);
  }

  /**
   * Log an error level message.
   *
   * @param message - Message to log.
   * @param meta - Additional metadata to append to logs.
   */
  error(message: string, meta?: any): void {
    this.logger.error(message, meta);
  }

  /**
   * Log a debug level message.
   *
   * @param message - Message to log.
   * @param meta - Additional metadata to append to logs.
   */
  debug(message: string, meta?: any): void {
    this.logger.debug(message, meta);
  }
}
