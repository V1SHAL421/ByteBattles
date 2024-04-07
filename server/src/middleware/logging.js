import winston from 'winston';

const logger = winston.createLogger({
  level: 'info', // Log only if info level or below
  format: winston.format.json(), // Provide the logs in JSON format
  transports: [
    new winston.transports.Console(), // Output logs to console
  ],
});

export default logger;
