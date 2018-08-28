import * as express from "express";

import { HomeController } from "./home/home.controller";
import { UserController } from "./user/user.controller";
import { ChecklistController } from "./checklist/checklist.controller";
import { DocTagController } from "./docTag/docTag.controller";

export const router = express.Router();

router.get("/", HomeController.load);
router.post("/register", UserController.userValidator(), UserController.register);
router.post("/login", UserController.userValidator(), UserController.login);

router.get("/tags/:tLabel", DocTagController.get);
router.post("/tags", DocTagController.postValidator(), DocTagController.post);

router.get("/checklists/user/:uId", ChecklistController.getByUser);
router.get("/anonchecklists/:cId", ChecklistController.getAnon);

router.get("/checklists/:cId", ChecklistController.get);
router.post("/checklists", ChecklistController.postValidator(), ChecklistController.post);
router.put("/checklists/:cId", ChecklistController.postValidator(), ChecklistController.put);
router.delete("/checklists/:cId", ChecklistController.delete);

router.put("/use/:cId", ChecklistController.use);
// TODO: convert to route.put "/anonchecklists/:cId
router.put("/use/anon/:cId", ChecklistController.useAnon);
router.post("/use/copy", ChecklistController.useCopy);
