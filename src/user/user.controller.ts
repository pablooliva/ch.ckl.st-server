import * as passport from "passport";

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

  public static login(req: Request, res: Response, next: NextFunction): Response {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }

    // matchedData returns only the subset of data validated by Express Validator
    const user = matchedData(req);
    console.warn(" *** STATUS: Success *** ", user);

    passport.authenticate("local", (err: Error, user: IUser, info: IVerifyOptions) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(400).json({ errors: info.message });
      }
      req.login(user, err => {
        if (err) {
          return next(err);
        }
        return res.status(200).json({ success: "Success! You are logged in." });
      });
    })(req, res, next);
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

        req.login(user, err => {
          if (err) {
            return next(err);
          }
          return res.status(200).json({ success: "Success! You are registered." });
        });
      });
    });
  }
}
