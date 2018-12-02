// import * as https from "https";
// import * as fs from "fs";

import { App } from "./config/express";
import { ClstLogger } from "./config/logger";

const log = ClstLogger.log();
const app = new App().express;
const port = process.env.PORT || 3000;
const server = app;

/*if (process.env.NODE_ENV === "dev") {
  const serverOptions = {
    key: fs.readFileSync("src/config/certs/rootCA.key"),
    cert: fs.readFileSync("src/config/certs/rootCA.crt")
  };
  server = <any>https.createServer(serverOptions, app);
} else {
  server = app;
}*/

server.listen(port, (err: Error) => {
  if (err) {
    return log.error(" *** Server error *** " + err.toString());
  }
  log.info(`Express server listening on port ${port}. Environment: ${process.env.NODE_ENV}.`);
});
