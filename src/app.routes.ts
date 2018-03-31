import * as express from "express";
import * as passportConfig from "./config/passport";

import { UserController } from "./user/user.controller";
import { HomeController } from "./home/home.controller";

export const router = express.Router();

/*
example:
app.get("/account", passportConfig.isAuthenticated, userController.getAccount);
 */

router.get("/", HomeController.load);
router.post("/register", UserController.userValidator(), UserController.register);
router.post("/login", UserController.userValidator(), UserController.login);
