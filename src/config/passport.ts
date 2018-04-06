import * as passport from "passport";
import * as passportJwt from "passport-jwt";
import * as _ from "lodash";

import { Request, Response, NextFunction } from "express";
import { User } from "../user/user.model";

export class PassportConfig {
  public constructor() {
    const JwtStrategy = passportJwt.Strategy;
    const ExtractJwt = passportJwt.ExtractJwt;
    const opts = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET
    };

    passport.use(
      new JwtStrategy(opts, (jwt_payload, done) => {
        User.findOne({ id: jwt_payload.id }, (err, user) => {
          if (err) {
            return done(err, false);
          }
          if (user) {
            done(null, user);
          } else {
            done(null, false);
          }
        });
      })
    );
  }

  public static isAuthenticated(req: Request, res: Response, next: NextFunction): any {
    if (req.isAuthenticated()) {
      return next();
    } else {
      return res.status(422).json({ errors: "you suck" });
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
