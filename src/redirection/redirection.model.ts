import * as mongoose from "mongoose";

interface IRedirection {
  active: boolean;
  created: string;
  source: string;
  target: string;
}

export interface IRedirectionModel extends IRedirection, mongoose.Document {}

const redirectionSchema = new mongoose.Schema({
  active: {
    type: Boolean,
    default: true
  },
  created: {
    type: Date,
    default: Date.now()
  },
  source: {
    type: String,
    required: "{PATH} is required!"
  },
  target: {
    type: String,
    required: "{PATH} is required!"
  }
});

export const Redirection = mongoose.model<IRedirectionModel>(
  "Redirection",
  redirectionSchema
);

export const cleanCollection = () => Redirection.remove({}).exec();
