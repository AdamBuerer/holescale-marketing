// Simple logging utility for marketing site

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private formatMessage(level: string, message: string, context?: LogContext): void {
    const timestamp = new Date().toISOString();

    // In development, pretty print
    if (import.meta.env.DEV) {
      const prefix = `[${timestamp}] ${level.toUpperCase()}:`;
      if (context) {
        console.group(prefix, message);
        console.log(context);
        console.groupEnd();
      } else {
        console.log(prefix, message);
      }
    }

    // In production, only log errors
    if (import.meta.env.PROD && level === 'ERROR') {
      console.error(message, context);
    }
  }

  error(message: string, context?: LogContext): void {
    this.formatMessage('ERROR', message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.formatMessage('WARN', message, context);
  }

  info(message: string, context?: LogContext): void {
    if (import.meta.env.DEV) {
      this.formatMessage('INFO', message, context);
    }
  }

  debug(message: string, context?: LogContext): void {
    if (import.meta.env.DEV) {
      this.formatMessage('DEBUG', message, context);
    }
  }

  log(...args: unknown[]): void {
    if (import.meta.env.DEV) {
      console.log(...args);
    }
  }
}

export const logger = new Logger();
