// Logging middleware - add your logging logic here
import winston from 'winston';
import fs from 'fs';
import path from 'path';

// Ensure logs directory exists
const logsDir = path.resolve('logs');
if (!fs.existsSync(logsDir))  fs.mkdirSync(logsDir);


// defining the structure for a log...
const loggingFormat = winston.format.printf((info) =>{
        const requestInfo = info.meta && info.meta.request ? info.meta.request : 'No request info';
        return `${info.timestamp} - ${info.level}: ${info.message} - ${requestInfo}`;
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