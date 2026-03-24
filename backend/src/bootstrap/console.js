const { redactSensitiveData } = require('../helpers/security');

function formatArg(arg) {
  if (arg instanceof Error) {
    return JSON.stringify(redactSensitiveData(arg));
  }

  if (typeof arg === 'object' && arg !== null) {
    try {
      return JSON.stringify(redactSensitiveData(arg));
    } catch (error) {
      return '[unserializable-object]';
    }
  }

  return arg;
}

function installProductionConsoleGuards() {
  if (process.env.NODE_ENV !== 'production' || process.env.ALLOW_PLAIN_CONSOLE === 'true') {
    return;
  }

  console.log = () => {};
  console.info = () => {};
  console.debug = () => {};

  const originalWarn = console.warn.bind(console);
  const originalError = console.error.bind(console);

  console.warn = (...args) => originalWarn(...args.map(formatArg));
  console.error = (...args) => originalError(...args.map(formatArg));
}

module.exports = {
  installProductionConsoleGuards,
};
