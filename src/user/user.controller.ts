import * as passport from "passport";
import * as jwt from "jsonwebtoken";

import { NextFunction, Request, Response } from "express";
import { check, validationResult } from "express-validator/check";
import { matchedData } from "express-validator/filter";
import { IVerifyOptions } from "passport-local";
import { IUser, User } from "./user.model";

export class UserController {
  public static userValidator(): any[] {
    return [
      check("email")
        .exists()
        .isEmail()
        .withMessage("Email is not valid")
        .trim(),
      check("password")
        .exists()
        .isLength({ min: 8 })
        .withMessage("Passwords must be at least 8 chars long")
        .trim()
    ];
  }

  public static register(req: Request, res: Response, next: NextFunction): Response {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }

    const user = new User({
      email: req.body.email,
      password: req.body.password
    });

    User.findOne({ email: req.body.email }, (err, existingUser) => {
      if (err) {
        return next(err);
      }
      if (existingUser) {
        return res.status(422).json({ errors: "Account with that email address already exists." });
      }

      user.save(err => {
        if (err) {
          return next(err);
        }
        return res.status(200).json({ success: "Success! You are registered." });
      });
    });
  }

  public static login(req: Request, res: Response, next: NextFunction): Response {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }

    // matchedData returns only the subset of data validated by Express Validator
    const validatedReq = matchedData(req);

    User.findOne({ email: validatedReq.email }, (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res
          .status(401)
          .send({ success: false, msg: "Authentication failed. Please try again." });
      } else {
        user
          .comparePassword(validatedReq.password)
          .then(isMatch => {
            const token = jwt.sign(JSON.stringify(user), process.env.SECRET);
            return res.json({ success: true, token: token });
          })
          .catch(err => {
            console.warn("err", err);
            return res
              .status(401)
              .send({ success: false, msg: "Authentication failed. Wrong password." });
          });
      }
    });
  }

  public static test(req: Request, res: Response, next: NextFunction): Response {
    console.warn("*** API YES ***");
    return res.status(200).json({ success: "Success! Authenticated!" });
  }
}
