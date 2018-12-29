import * as express from "express";
import * as expressSession from "express-session";
import * as passport from "passport";
import * as fs from "fs";
import * as path from "path";
import * as favicon from "serve-favicon";
import * as logger from "morgan";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import * as lusca from "lusca";
import * as mongo from "connect-mongo";

import { Db } from "./db";
// import { MongoStoreFactory } from "connect-mongo";
import { PassportConfig } from "./passport";
import { router as appRoutes } from "../app.routes";

export class App {
  private _db: Db;
  private _MongoStore: any;
  private _passportConfig: PassportConfig;

  public express: express.Application;

  public constructor() {
    if (fs.existsSync(path.join(__dirname, ".env"))) {
      dotenv.config({ path: path.join(__dirname, ".env") });
    }
    this.express = express();

    this._db = new Db();
    this._db.connect();
    this._MongoStore = mongo(expressSession);
    this._passportConfig = new PassportConfig();
    this._expressConfig();
  }

  private _expressConfig(): void {
    this.express.set("views", path.join(__dirname, "..", "public"));
    this.express.set("view engine", "html");
    this.express.engine("html", function(path: any, options: any, cb: any) {
      fs.readFile(path, "utf-8", cb);
    });
    this.express.use(logger("dev"));
    this.express.use(cookieParser());
    this.express.use(bodyParser.json({ type: "application/json" }));
    this.express.use(
      bodyParser.urlencoded({
        extended: true,
        type: "application/x-www-form-urlencoded"
      })
    );
    this.express.use(
      expressSession({
        resave: true,
        saveUninitialized: true,
        secret: process.env.SECRET,
        store: new this._MongoStore({
          url: this._db.getDbUrl(),
          autoReconnect: true
        }),
        cookie: {
          secure: process.env.NODE_ENV === "prod"
        }
      })
    );
    this.express.use(passport.initialize());
    this.express.use(
      lusca({
        csrf: {
          angular: true,
          cookie: "XSRF-TOKEN"
        },
        csp: {
          policy: {
            "default-src": "'self'"
          }
        },
        xframe: "SAMEORIGIN",
        p3p: "ABCDEF",
        hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
        xssProtection: true,
        nosniff: true,
        referrerPolicy: "same-origin"
      })
    );
    this.express.use((req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Authorization, Origin, X-Requested-With, Content-Type, Accept"
      );
      res.setHeader(
        "Access-Control-Allow-Methods",
        "POST, PUT, GET, DELETE, OPTIONS"
      );
      next();
    });
    this.express.use((req, res, next) => {
      res.locals.user = req.user;
      next();
    });

    // so we can get the client's IP address
    this.express.enable("trust proxy");
    this.express.use(express.static(path.join(__dirname, "..", "public")));
    this.express.use(
      favicon(path.join(__dirname, "..", "public", "favicon.ico"))
    );
    this.express.use(
      "/user-images",
      express.static(path.join(__dirname, "..", "public", "user-images"), {
        index: false
      })
    );
    this.express.use("/", appRoutes);

    // catch 404 and forward to error handler
    this.express.use((req, res) => {
      console.warn("*** ERROR: reached 404 section ***");
      return res.render("index");
    });

    this.express.on("uncaughtException", err => {
      console.error("uncaughtException: ", err);
      console.error(err.stack);
    });
  }
}
