import * as https from "https";
import * as fs from "fs";

import { App } from "./config/express";
import { ClstLogger } from "./config/logger";

const log = ClstLogger.log();
const app = new App().express;
const port = process.env.PORT || 3000;
const sslPort = process.env.SSL_PORT || 443;
let server;
let listeningPort;

if (process.env.NODE_ENV === "prod" && process.env.SERVER !== "local") {
  const serverOptions = {
    key: fs.readFileSync("/etc/letsencrypt/live/api.ch.ckl.st/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/api.ch.ckl.st/fullchain.pem"),
    ca: fs.readFileSync("/etc/letsencrypt/live/api.ch.ckl.st/chain1.pem")
  };
  server = <any>https.createServer(serverOptions, app);
  listeningPort = sslPort;
} else {
  server = app;
  listeningPort = port;
}

server.listen(listeningPort, (err: Error) => {
  if (err) {
    return log.error(" *** Server error *** " + err.toString());
  }
  log.info(`Express server listening on port ${listeningPort}. Environment: ${process.env.NODE_ENV}.`);
});