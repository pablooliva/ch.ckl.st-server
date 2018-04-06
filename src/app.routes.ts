import * as express from "express";
import * as passport from "passport";

import { UserController } from "./user/user.controller";
import { HomeController } from "./home/home.controller";

export const router = express.Router();

router.get("/", HomeController.load);
router.post("/register", UserController.userValidator(), UserController.register);
router.post("/login", UserController.userValidator(), UserController.login);
router.get("/test", passport.authenticate("jwt", { session: false }), UserController.test);
