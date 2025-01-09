import globalConfig from '../config';

/**
 * log
 *
 * <p>
 *
 *  https://developers.google.com/web/tools/chrome-devtools/console/console-write#_8
 * </p>
 */
class Logger {


  static LOG_LEVEL_DEBUG = 1;
  static LOG_LEVEL_INFO = 2;
  static LOG_LEVEL_WARN = 3;
  static LOG_LEVEL_ERROR = 4;

  static loggerMap = new Map();

  static debugLoggers = new Set();
  static infoLoggers = new Set();
  static warnLoggers = new Set();
  static errorLoggers = new Set();

  static defaultLogger = new Logger();  

  /**
   * 
   *
   * @param name
   * @returns {*}
   */
  static getLogger(name) {
    if (name && name !== '') {
      if (Logger.loggerMap.has(name)) {
        return Logger.loggerMap.get(name);
      }

      const logger = new Logger(name);
      Logger.loggerMap.set(name, logger);
      return logger;
    } else {
      return Logger.defaultLogger;
    }
  }

  constructor(name) {
    this.name = name;  
    if (Logger.debugLoggers.has(name)) {
      this.logLevel = Logger.LOG_LEVEL_DEBUG;
      return;
    }
    if (Logger.infoLoggers.has(name)) {
      this.logLevel = Logger.LOG_LEVEL_INFO;
      return;
    }
    if (Logger.warnLoggers.has(name)) {
      this.logLevel = Logger.LOG_LEVEL_WARN;
      return;
    }
    if (Logger.errorLoggers.has(name)) {
      this.logLevel = Logger.LOG_LEVEL_ERROR;
      return;
    }

    const configLogLevel = globalConfig.log.level;
    if (configLogLevel === 'debug') {
      this.logLevel = Logger.LOG_LEVEL_DEBUG;
    } else if (configLogLevel === 'info') {
      this.logLevel = Logger.LOG_LEVEL_INFO;
    } else if (configLogLevel === 'warn') {
      this.logLevel = Logger.LOG_LEVEL_WARN;
    } else if (configLogLevel === 'error') {
      this.logLevel = Logger.LOG_LEVEL_ERROR;
    } else {
      this.error('unsupported logLevel: %s, use INFO instead', configLogLevel);
      this.logLevel = Logger.LOG_LEVEL_INFO;
    }
  }

  /**
   * 
   *
   * @param newLogLevel 
   */
  setLogLevel(newLogLevel) {
    if (isNaN(newLogLevel)) {
      this.error('setLogLevel error, not a number: %s', newLogLevel);
    }

    if (newLogLevel < 1 || newLogLevel > 4) {
      this.error('setLogLevel error, input = %s, must between 1 and 4', newLogLevel);
    }

    this.logLevel = newLogLevel;
  }

  /**
   * 
   *
   * @param pattern 
   * @param args 
   */
  info(pattern, ...args) {
    if (this.logLevel > Logger.LOG_LEVEL_INFO)
      return;

    if (this.name)
      args.unshift(`${this.name}: ${pattern}`);
    else
      args.unshift(pattern);
    console.log.apply(console, args);
  }

  /**
   * 
   *
   * @param pattern
   * @param args
   */
  error(pattern, ...args) {
    if (this.logLevel > Logger.LOG_LEVEL_ERROR)
      return;

    args.unshift('background: red; color: #bada55;');
    if (this.name)
      args.unshift(`%c${this.name}: ${pattern}`);
    else
      args.unshift(`%c${pattern}`);
    console.error.apply(console, args);
  }

  /**
   * 
   *
   * @param pattern
   * @param args
   */
  debug(pattern, ...args) {
    if (this.logLevel > Logger.LOG_LEVEL_DEBUG)
      return;

    args.unshift('background: black; color: #bada55;');
    if (this.name)
      args.unshift(`%c${this.name}: ${pattern}`);
    else
      args.unshift(`%c${pattern}`);
    console.debug.apply(console, args);

  }

  /**
   * 
   *
   * @param pattern
   * @param args
   */
  warn(pattern, ...args) {
    if (this.logLevel > Logger.LOG_LEVEL_WARN)
      return;

    args.unshift('background: yellow; color: black;');
    if (this.name)
      args.unshift(`%c${this.name}: ${pattern}`);
    else
      args.unshift(`%c${pattern}`);
    console.warn.apply(console, args);
  }
}

['debug', 'info', 'warn', 'error'].forEach((level) => {
  if (globalConfig.log[level]) {
    for (const logger of globalConfig.log[level]) {
      Logger[`${level}Loggers`].add(logger);
    }
  }
});

export default Logger;
