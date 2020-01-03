import * as mongoose from "mongoose";

import { ClstLogger } from "./logger";
import { Logger } from "winston";

export class Db {
  private _dbName: string;
  private _log: Logger;

  public constructor() {
    this._log = ClstLogger.log();
  }

  public connect(): void {
    mongoose
      .connect(this.getDbUrl(), {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then(() => {
        this._log.info("mLab Connected");
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

  public getDbUrl(): string {
    return process.env.NODE_ENV === "prod"
      ? process.env.DB_PROD_URI
      : process.env.DB_URI;
  }
}
