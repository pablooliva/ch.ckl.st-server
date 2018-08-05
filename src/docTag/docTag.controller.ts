import { NextFunction, Request, Response } from "express";
import { check, validationResult } from "express-validator/check";
import { matchedData } from "express-validator/filter";

import { DocumentTag } from "./documentTag.model";

export class DocTagController {
  public static postValidator(): any {
    return [
      check("label")
        .trim()
        .exists()
        .not()
        .isEmpty()
        //.isAlphanumeric()
        .withMessage("Tag label is not valid")
    ];
  }

  public static get(req: Request, res: Response, next: NextFunction): void | Response {
    DocumentTag.findOne({ label: req.params.tLabel }, (err, docTag) => {
      if (err) {
        console.warn("error", err);
        return next(err);
      } else {
        console.warn("docTag", docTag);
        if (docTag) {
          return res.status(200).json({ label: docTag.label, id: docTag._id });
        } else {
          return res.status(200).json({ noResult: true });
        }
      }
    });
  }

  public static post(req: Request, res: Response, next: NextFunction): Response {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }

    // matchedData returns only the subset of data validated by Express Validator
    const validatedReq = matchedData(req);
    const tag = new DocumentTag({
      owner: req.body.owner,
      label: validatedReq.label
    });

    tag.save(err => {
      if (err) {
        return next(err);
      } else {
        return res.status(200).json({
          label: validatedReq.label,
          id: tag._id
        });
      }
    });
  }
}
