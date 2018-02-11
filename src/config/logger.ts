import * as winston from "winston";
import { LoggerInstance } from "winston";

export class Logger {
    public static log(): LoggerInstance {
        (<any>winston).emitErrs = true;

        return new winston.Logger({
            transports: [
                new winston.transports.Console({
                    level: "debug",
                    handleExceptions: true,
                    json: false,
                    colorize: true
                })
            ],
            exitOnError: false
        });
    }
}