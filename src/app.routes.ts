import * as express from "express";
import * as multer from "multer";

import { HomeController } from "./home/home.controller";
import { UserController } from "./user/user.controller";
import { ChecklistController } from "./checklist/checklist.controller";
import { DocTagController } from "./docTag/docTag.controller";
import { RedirectionController } from "./redirection/redirection.controller";
import { UserImageController } from "./userFiles/userImage.controller";

export const router = express.Router();

router.get("/", HomeController.load);
router.post(
  "/register",
  UserController.userValidator(),
  UserController.register
);
router.post("/login", UserController.userValidator(), UserController.login);

router.get("/tags/:tLabel", DocTagController.get);
router.post("/tags", DocTagController.postValidator(), DocTagController.post);

router.get("/anonchecklists/:cId", ChecklistController.getAnon);
router.put("/anonchecklists/:cId", ChecklistController.useAnon);

router.get("/checklists/user/:uId", ChecklistController.getByUser);
router.get("/checklists/:cId", ChecklistController.get);
router.post(
  "/checklists",
  ChecklistController.postValidator(),
  ChecklistController.post
);
router.put(
  "/checklists/:cId",
  ChecklistController.postValidator(),
  ChecklistController.put
);
router.delete("/checklists/:cId", ChecklistController.delete);

router.put("/use/:cId", ChecklistController.use);
router.post("/use/copy", ChecklistController.useCopy);

router.post(
  "/images",
  multer({ storage: UserImageController.storage }).single("image"),
  UserImageController.post
);

router.get("/r/:rSource", RedirectionController.get);
