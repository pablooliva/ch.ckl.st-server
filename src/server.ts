import { App } from "./config/express";
import { Logger } from "./config/logger";

const log = Logger.log();
const app = new App().express;
const port = process.env.PORT || 3000;

app.listen(port, (err: Error) => {
    if (err) {
        return log.error(err.toString());
    }
    log.info(`
        Express server listening on port ${port}.
        Environment: ${process.env.NODE_ENV}
    `);
});