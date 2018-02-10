import * as express from "express";
import { Request, Response } from "express";

const router = express.Router();

router.get("/", function (req: Request, res: Response, next: any) {
  res.render("index");
});

module.exports = router;