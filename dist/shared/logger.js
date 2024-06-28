"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorLogger = exports.logger = void 0;
const path_1 = __importDefault(require("path"));
const winston_1 = require("winston");
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { combine, timestamp, label, printf, errors } = winston_1.format;
// Custom Log Format
const myFormat = printf(({ level, message, label, timestamp, stack }) => {
    const date = new Date(timestamp);
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${date.toDateString()} ${hour}:${minutes}:${seconds} [${label}] ${level}: ${stack || message}`;
});
const createTransport = (level, filename) => {
    return new winston_daily_rotate_file_1.default({
        level,
        filename: path_1.default.join(process.cwd(), "logs", filename, `DPS-%DATE%-${level}.log`),
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "14d",
    });
};
const createTransports = () => {
    const transportList = [
        new winston_1.transports.Console(),
        createTransport("info", "success"),
        createTransport("error", "errors"),
    ];
    return transportList;
};
const logger = (0, winston_1.createLogger)({
    level: "info",
    format: combine(label({ label: "Doctor Server" }), timestamp(), errors({ stack: true }), myFormat),
    transports: createTransports(),
    exceptionHandlers: [
        new winston_1.transports.Console(),
        createTransport("exceptions", "exceptions"),
    ],
    rejectionHandlers: [
        new winston_1.transports.Console(),
        createTransport("rejections", "rejections"),
    ],
});
exports.logger = logger;
// Additional logger for errors
const errorLogger = (0, winston_1.createLogger)({
    level: "error",
    format: combine(label({ label: "Doctor Server" }), timestamp(), errors({ stack: true }), myFormat),
    transports: createTransports(),
});
exports.errorLogger = errorLogger;
