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

import { Db } from "./db";
import { PassportConfig } from "./passport";
import { router as appRoutes } from "../app.routes";

export class App {
  private _db: Db;
  private _passportConfig: PassportConfig;

  public express: express.Application;

  public constructor() {
    dotenv.config({ path: path.join(__dirname, ".env") });
    this.express = express();

    this._db = new Db();
    this._db.connect();
    this._passportConfig = new PassportConfig();
    this._expressConfig();
  }

  private _expressConfig(): void {
    this.express.set("views", path.join(__dirname, "..", "public"));
    this.express.set("view engine", "html");
    this.express.engine("html", function(path: any, options: any, cb: any) {
      fs.readFile(path, "utf-8", cb);
    });

    this.express.use(favicon(path.join(__dirname, "..", "public", "favicon.ico")));
    this.express.use(logger("dev"));
    this.express.use(cookieParser());
    this.express.use(bodyParser.json({ type: "application/json" }));
    this.express.use(
      bodyParser.urlencoded({
        extended: true,
        type: "application/x-www-form-urlencoded"
      })
    );
    this.express.use(express.static(path.join(__dirname, "..", "public")));
    this.express.use(
      expressSession({
        resave: true,
        saveUninitialized: true,
        secret: process.env.SECRET
      })
    );
    this.express.use(passport.initialize());
    /*this.express.use(
      lusca({
        // csrf: true,
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
    );*/
    this.express.use((req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Authorization, Origin, X-Requested-With, Content-Type, Accept"
      );
      res.setHeader("Access-Control-Allow-Methods", "POST, GET, PATCH, DELETE, OPTIONS");
      next();
    });
    this.express.use((req, res, next) => {
      res.locals.user = req.user;
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
    this.express.use((req, res) => {
      console.warn("*** GOT HERE ***");
      return res.render("index");
    });

    this.express.on("uncaughtException", err => {
      console.error("uncaughtException: ", err.message);
      console.error(err.stack);
    });
  }
}
