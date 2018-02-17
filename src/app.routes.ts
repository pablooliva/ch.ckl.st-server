import * as express from "express";
import { Request, Response } from "express";

import * as passportConfig from "./config/passport";

const router = express.Router();

/*
example:
app.get("/account", passportConfig.isAuthenticated, userController.getAccount);
 */
router.get("/", function(req: Request, res: Response, next: Function) {
  res.render("index");
});

module.exports = router;
