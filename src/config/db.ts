import * as mongoose from "mongoose";

import { Logger } from "./logger";
import { LoggerInstance } from "winston";

export class Db {
  private _dbName: string;
  private _log: LoggerInstance;

  public constructor() {
    this._log = Logger.log();

    switch (process.env.NODE_ENV) {
      case "test":
      case "dev":
      case "prod":
        this._dbName = "checklist";
        break;
      default:
        this._dbName = "checklist";
    }
  }

  public connect(): void {
    mongoose
      .connect(process.env.DB_URI + this._dbName)
      .then(msg => {
        this._log.info("mLab Connected: " + msg);
      })
      .catch(err => {
        this._log.error("No connection to mLab: " + err);
      });

    mongoose.connection.on("error", (err: Error) => {
      if (err.message.indexOf("ECONNREFUSED") !== -1) {
        this._log.error("Error: The server was not able to reach MongoDB.");
        process.exit(1);
      } else {
        throw err;
      }
    });
  }
}
