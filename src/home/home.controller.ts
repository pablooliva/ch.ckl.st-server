import { Request, Response } from "express";

export class HomeController {
  public static load(req: Request, res: Response): void {
    res.render("index");
  }
}
