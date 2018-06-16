import * as mongoose from "mongoose";

export interface IDocumentTag {
  owner: mongoose.Schema.Types.ObjectId;
  active: boolean;
  created: Date;
  label: string;
}

interface IDocumentTagModel extends IDocumentTag, mongoose.Document {}

export const documentTagSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  active: {
    type: Boolean,
    default: true
  },
  created: {
    type: Date,
    default: Date.now()
  },
  label: String
});

export const DocumentTag = mongoose.model<IDocumentTagModel>("DocumentTag", documentTagSchema);

export const cleanCollection = () => DocumentTag.remove({}).exec();
