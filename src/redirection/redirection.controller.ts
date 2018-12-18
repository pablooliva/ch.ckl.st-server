import { NextFunction, Request, Response } from "express";

import { Redirection, IRedirectionModel } from "./redirection.model";

export class RedirectionController {
  public static get(
    req: Request,
    res: Response,
    next: NextFunction
  ): void | Response {
    Redirection.findOne(
      { source: req.params.rSource },
      (err: any, redirection: IRedirectionModel) => {
        return err
          ? next(err)
          : redirection && redirection.active
          ? res.status(200).json(redirection)
          : res.status(204).json({
              error: "A redirect for this URL is no longer available."
            });
      }
    );
  }
}
