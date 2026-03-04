import winston from "winston";
import fs from "fs";
import path from "path";

const logDir = "logs";

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const { combine, timestamp, errors, json } = winston.format;

const logger = winston.createLogger({
  level: "info",
  format: combine(
    timestamp(),
    errors({ stack: true }),
    json()
  ),
  defaultMeta: { service: "focustube-backend" },
  transports: [
    new winston.transports.Console(),

    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error"
    }),

    new winston.transports.File({
      filename: path.join(logDir, "combined.log")
    })
  ]
});

export default logger;