import * as winston from "winston";
import { Logger, format, createLogger } from "winston";

export class ClstLogger {
    public static log(): Logger {
      const logger = createLogger({
        level: "info",
        format: format.combine(
          format.timestamp(),
          format.json()
        ),
        transports: [
          new winston.transports.File({ filename: "error.log", level: "error" }),
          new winston.transports.File({ filename: "combined.log" })
        ],
        exitOnError: false
      });

      if (process.env.NODE_ENV !== "production") {
        logger.add(new winston.transports.Console({
          level: "debug",
          handleExceptions: true,
          format: format.combine(
            format.colorize(),
            format.timestamp(),
            format.prettyPrint(),
            format.simple()
          )
        }));
      }

        return logger;
    }
}