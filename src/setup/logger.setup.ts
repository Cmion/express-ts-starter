import {format, createLogger, transports} from 'winston';

const _createErrorFormat = format((info) => {
//   if (info.message instanceof Error) {
//     // eslint-disable-next-line no-param-reassign
//     info.message = Object.assign(
//       { message: `${info.message.message}\n============\n${info.message.stack}` },
//       info.message,
//     );
//   }
  if (info instanceof Error) {
    return Object.assign({ message: `${info.message}\n${info.stack}` }, info);
  }
  return info;
});

const logger = createLogger({
  format: format.combine(
    format.colorize(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    _createErrorFormat(),
    format.printf((info) => {
      const { timestamp, level, message, ...args } = info;
      let argumentText = '';
      if (Object.keys(args).length) {
        if (process.env.NODE_ENV === 'development') {
          argumentText = JSON.stringify(args);
        } else {
          argumentText = JSON.stringify(args);
        }
      }
      return `${timestamp} [${level}]: ${
        typeof message === 'object' ? JSON.stringify(message) : message
      }\n${argumentText}`;
    }),
  ),
  transports: [
    new transports.Console({
      level: process.env.LOG_LEVEL || 'debug',
      handleExceptions: true,
    }),
  ],
});

export default logger;
