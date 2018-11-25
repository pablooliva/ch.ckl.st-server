import * as bcrypt from "bcryptjs";
import * as mongoose from "mongoose";
import {NextFunction} from "express";

export interface IAuthToken {
  accessToken: string;
  kind: string;
}

export interface IUser {
  email: string;
  password: string;
  passwordResetToken: string;
  passwordResetExpires: Date;
  tokens: IAuthToken[];
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

/*  Detaches user definition and user DAL. If you want to switch from mongo
    to another db provider, you won't have to change user interface.
    https://github.com/Appsilon/styleguide/wiki/mongoose-typescript-models */
interface IUserModel extends IUser, mongoose.Document {}

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    password: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    tokens: Array
  },
  { timestamps: true }
);

userSchema.pre("save", function(next: NextFunction): void {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(12, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, (err: mongoose.Error, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword: string): Promise<boolean> {
  const password = this.password;
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, password, (err, success) => {
      return err || !success ? reject(err) : resolve(success);
    });
  });
};

export const User = mongoose.model<IUserModel>("User", userSchema);

export const cleanCollection = () => User.remove({}).exec();
