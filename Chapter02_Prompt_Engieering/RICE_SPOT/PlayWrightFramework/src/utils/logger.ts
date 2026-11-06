type LogContext = Record<string, string | number | boolean | undefined>;

function write(level: 'INFO' | 'WARN' | 'ERROR', message: string, context?: LogContext): void {
  const details = context ? ` ${JSON.stringify(context)}` : '';
  const output = `[${new Date().toISOString()}] ${level} ${message}${details}`;

  if (level === 'ERROR') {
    console.error(output);
  } else if (level === 'WARN') {
    console.warn(output);
  } else {
    console.info(output);
  }
}

export const logger = {
  info: (message: string, context?: LogContext): void => write('INFO', message, context),
  warn: (message: string, context?: LogContext): void => write('WARN', message, context),
  error: (message: string, context?: LogContext): void => write('ERROR', message, context),
};
