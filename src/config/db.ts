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
                this._dbName = "clst_dev";
                break;
            case "production":
                this._dbName = "clst_prod";
                break;
            default:
                this._dbName = "clst_dev";
        }
    }

    public connect(): void {
        /*mongoose.connect(`mongodb://${process.env.DB_IP}:27017/${this._dbName}`);

        mongoose.connection.on("error", (err: Error) => {
            if (err.message.indexOf("ECONNREFUSED") !== -1) {
                this._log.error("Error: The server was not able to reach MongoDB.");
                process.exit(1);
            } else {
                throw err;
            }
        });*/
    }
}