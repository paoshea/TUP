// Wrapper for console.log to ensure logs are captured
const logger = {
  log: (...args: any[]) => {
    // Force logs to appear in both browser and server console
    console.log(...args);
    if (typeof window !== 'undefined') {
      (window as any).lastLog = args;
    }
  },
  error: (...args: any[]) => {
    console.error(...args);
    if (typeof window !== 'undefined') {
      (window as any).lastError = args;
    }
  },
  info: (...args: any[]) => {
    console.info(...args);
    if (typeof window !== 'undefined') {
      (window as any).lastInfo = args;
    }
  },
  debug: (...args: any[]) => {
    console.debug(...args);
    if (typeof window !== 'undefined') {
      (window as any).lastDebug = args;
    }
  }
};

export default logger;