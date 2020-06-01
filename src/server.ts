import * as https from "https";
import * as fs from "fs";

import { App } from "./config/express";
import { ClstLogger } from "./config/logger";

const log = ClstLogger.log();
const devPort = 3000;
const prodPort = 80;
const server = new App().express;
const listeningPort =
  process.env.NODE_ENV === "prod" && process.env.SERVER !== "local"
    ? prodPort
    : devPort;

server.listen(listeningPort, (err: Error) => {
  if (err) {
    return log.error(" *** Server error *** " + err.toString());
  }
  log.info(
    `Express server listening on port ${listeningPort}. Environment: ${process.env.NODE_ENV}.`
  );
});
