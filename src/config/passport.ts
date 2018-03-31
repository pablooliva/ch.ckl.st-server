import * as passport from "passport";
import * as passportLocal from "passport-local";
import * as _ from "lodash";

import { Request, Response, NextFunction } from "express";
import { User } from "../user/user.model";

export class PassportConfig {
  public constructor() {
    const LocalStrategy = passportLocal.Strategy;

    passport.serializeUser<any, any>((user, done) => {
      done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
      User.findById(id, (err, user) => {
        done(err, user);
      });
    });

    passport.use(
      new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
        User.findOne({ email: email.toLowerCase() }, (err, user: any) => {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false, {
              message: `Email ${email} not found.`
            });
          }
          user.comparePassword(password).then((response: boolean) => {
            return response
              ? done(null, user)
              : done(null, false, {
                  message: "Invalid email or password."
                });
          });
        });
      })
    );
  }

  public static isAuthenticated(req: Request, res: Response, next: NextFunction): any {
    if (req.isAuthenticated()) {
      return next();
    }
  }

  public static isAuthorized(req: Request, res: Response, next: NextFunction): any {
    const provider = req.path.split("/").slice(-1)[0];

    if (_.find(req.user.tokens, { kind: provider })) {
      next();
    } else {
      res.sendStatus(403).json({ errors: "User is not authorized for this." });
    }
  }
}
