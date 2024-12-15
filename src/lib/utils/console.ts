/* eslint-disable @typescript-eslint/no-empty-function */


export function setupConsoleOverride() {
  // Only override in production
  if (import.meta.env.PROD) {
    const noop = () => {};
    
    // Save original methods in case we need them
    const originalConsole = {
      log: console.log,
      debug: console.debug,
      info: console.info,
      warn: console.warn,
      // Keeping error for production debugging
      // error: console.error
    };

    // Override methods
    Object.keys(originalConsole).forEach(method => {
      console[method] = noop;
    });

    // Add a way to restore if needed
    (console as any).restore = () => {
      Object.keys(originalConsole).forEach(method => {
        console[method] = originalConsole[method];
      });
    };
  }
}