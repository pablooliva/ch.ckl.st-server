import * as mongoose from "mongoose";

import { IDocumentTag } from "../docTag/documentTag.model";

export interface IChecklistItemTag {
  label: string;
  color: string;
  icon: string;
}

export interface IChecklistItem {
  label: string;
  checked: boolean;
  flexibleText: string;
  checklistTagsEnabled: mongoose.Schema.Types.ObjectId[];
}

export interface ISection {
  title: string;
  flexibleText: string;
  checklistItems: IChecklistItem[];
}

interface IBaseDocument {
  parentChecklist: mongoose.Schema.Types.ObjectId;
  active: boolean;
  public: boolean;
  created: Date;
  updated: Date;
  documentTitle: string;
  documentTags: IDocumentTag[];
  checklistTags: IChecklistItemTag[];
  customCss: string;
  sections: ISection[];
}

export interface IDocument extends IBaseDocument {
  owner: mongoose.Schema.Types.ObjectId;
}

export interface IAnonDocument extends IBaseDocument {
  owner: string;
}

export interface IChecklistModel extends IDocument, mongoose.Document {}

export interface IAnonChecklistModel extends IAnonDocument, mongoose.Document {}

const checklistItemTagSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true
  },
  color: String,
  icon: String
});

const checklistItemSchema = new mongoose.Schema({
  checked: Boolean,
  label: {
    type: String,
    required: true
  },
  flexibleText: String,
  checklistTagsEnabled: [{ tag: Boolean }]
});

const sectionSchema = new mongoose.Schema({
  title: String,
  flexibleText: String,
  checklistItems: [checklistItemSchema]
});

const checklistSchema = new mongoose.Schema({
  parentChecklist: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: "Checklist"
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  public: {
    type: Boolean,
    default: true
  },
  created: {
    type: Date,
    default: Date.now()
  },
  updated: {
    type: Date,
    default: Date.now()
  },
  documentTitle: {
    type: String,
    required: "{PATH} is required!"
  },
  documentTags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DocumentTag"
    }
  ],
  checklistTags: [checklistItemTagSchema],
  customCss: String,
  sections: [sectionSchema]
});

const anonChecklistSchema = new mongoose.Schema({
  parentChecklist: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: "Checklist"
  },
  owner: {
    type: String,
    default: "anon"
  },
  active: {
    type: Boolean,
    default: true
  },
  public: {
    type: Boolean,
    default: true
  },
  created: {
    type: Date,
    default: Date.now()
  },
  updated: {
    type: Date,
    default: Date.now()
  },
  documentTitle: {
    type: String,
    required: "{PATH} is required!"
  },
  documentTags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DocumentTag"
    }
  ],
  checklistTags: [checklistItemTagSchema],
  customCss: String,
  sections: [sectionSchema]
});

export const Checklist = mongoose.model<IChecklistModel>("Checklist", checklistSchema);

export const cleanCollection = () => Checklist.remove({}).exec();

export const AnonChecklist = mongoose.model<IAnonChecklistModel>(
  "AnonChecklist",
  anonChecklistSchema
);

export const cleanAnonCollection = () => AnonChecklist.remove({}).exec();
