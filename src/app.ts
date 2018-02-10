import * as express from "express";
import * as fs from "fs";
import * as path from "path";
import * as favicon from "serve-favicon";
import * as logger from "morgan";
import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import * as dotenv from "dotenv";

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: ".env" });

let appRoutes = require("./routes/app");

const app = express();

app.set("views", path.join(__dirname, "public"));
app.set("view engine", "html");
app.engine("html", function(path: any, options: any, cb: any) {
    fs.readFile(path, 'utf-8', cb);
});

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PATCH, DELETE, OPTIONS");
    next();
});

app.use("/", appRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    return res.render("index");
});

module.exports = app;
