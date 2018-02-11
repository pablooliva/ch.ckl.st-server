import * as express from "express";
import * as fs from "fs";
import * as path from "path";
import * as favicon from "serve-favicon";
import * as logger from "morgan";
import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import * as dotenv from "dotenv";

class App {
    public express: express.Application;

    public constructor() {
        this.express = express();
        this.config();
    }

    private config(): void {
        const appRoutes = require("./routes/app.routes");

        dotenv.config({ path: ".env" });

        this.express.set("views", path.join(__dirname, "public"));
        this.express.set("view engine", "html");
        this.express.engine("html", function(path: any, options: any, cb: any) {
            fs.readFile(path, "utf-8", cb);
        });

        // this.express.use(favicon(path.join(__dirname, "public", "favicon.ico")));
        this.express.use(logger("dev"));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(cookieParser());
        this.express.use(express.static(path.join(__dirname, "public")));

        this.express.use(function (req, res, next) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.setHeader("Access-Control-Allow-Methods", "POST, GET, PATCH, DELETE, OPTIONS");
            next();
        });

        this.express.use("/", appRoutes);

        // catch 404 and forward to error handler
        this.express.use(function(req, res, next) {
            return res.render("index");
        });
    }
}

export default new App().express;