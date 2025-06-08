// Logging middleware - add your logging logic here
import winston from 'winston';

// defining the structure for a log...
const loggingFormat = winston.format.printf((info) =>{
        return `${info.timestamp} - ${info.level}: ${info.message} - ${info.meta.request}`;
})

// creating logger instance...
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        loggingFormat
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error'}),
        new winston.transports.File({ filename: 'logs/combined.log', level: 'info'}),
    ],
})

export default logger ;