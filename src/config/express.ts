import * as express from "express";
import * as expressValidator from "express-validator";
import * as session from "express-session";
import * as fs from "fs";
import * as path from "path";
import * as favicon from "serve-favicon";
import * as logger from "morgan";
import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import * as dotenv from "dotenv";
import * as lusca from "lusca";
import * as mongo from "connect-mongo";
import * as flash from "express-flash";

import { Db } from "./db";
import { MongoStoreFactory } from "connect-mongo";
// const auth = require("../controllers/auth").default;

export class App {
  private _MongoStore: MongoStoreFactory;
  private _db: Db;

  public express: express.Application;

  public constructor() {
    dotenv.config({ path: path.join(__dirname, ".env") });

    this._MongoStore = mongo(session);
    this._db = new Db();
    this._db.connect();

    this.express = express();
    this._config();
  }

  private _config(): void {
    const appRoutes = require("../app.routes");

    this.express.set("views", path.join(__dirname, "..", "public"));
    this.express.set("view engine", "html");
    this.express.engine("html", function(path: any, options: any, cb: any) {
      fs.readFile(path, "utf-8", cb);
    });

    this.express.use(
      favicon(path.join(__dirname, "..", "public", "favicon.ico"))
    );
    this.express.use(logger("dev"));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(cookieParser());
    this.express.use(express.static(path.join(__dirname, "..", "public")));
    this.express.use(
      expressValidator({
        customValidators: {
          isArray: function(value) {
            return Array.isArray(value);
          }
        }
      })
    );

    this.express.use(function(req, res, next) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      res.setHeader(
        "Access-Control-Allow-Methods",
        "POST, GET, PATCH, DELETE, OPTIONS"
      );
      next();
    });

    // so we can get the client's IP address
    this.express.enable("trust proxy");

    // this.express.use(auth.initialize());

    /*this.express.all(process.env.API_BASE + "*", (req, res, next) => {
            if (req.path.includes(process.env.API_BASE + "login")) return next();

            return auth.authenticate((err, user, info) => {
                if (err) { return next(err); }
                if (!user) {
                    if (info.name === "TokenExpiredError") {
                        return res.status(401).json({ message: "Your token has expired. Please generate a new one" });
                    } else {
                        return res.status(401).json({ message: info.message });
                    }
                }
                this.express.set("user", user);
                return next();
            })(req, res, next);
        });*/

    this.express.use("/", appRoutes);

    // catch 404 and forward to error handler
    this.express.use(function(req, res, next) {
      return res.render("index");
    });
  }
}
