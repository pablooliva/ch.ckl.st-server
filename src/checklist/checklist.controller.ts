import { NextFunction, Request, Response } from "express";
import { check, validationResult } from "express-validator/check";
import { matchedData } from "express-validator/filter";

import { Checklist, AnonChecklist, IChecklistModel, ISection } from "./checklist.model";

export class ChecklistController {
  public static postValidator(): any {
    return [
      check("documentTitle")
        .trim()
        .exists()
        .not()
        .isEmpty()
        //.isAlphanumeric()
        .withMessage("Checklist document title is not valid")
    ];
  }

  public static get(req: Request, res: Response, next: NextFunction): void | Response {
    // TODO: check if owner is requesting and/or public=true
    Checklist.findById(req.params.cId)
      .populate("documentTags")
      .exec((err, checklist) => {
        return err ? next(err) : res.status(200).json(checklist);
      });
  }

  public static getAnon(req: Request, res: Response, next: NextFunction): void | Response {
    // TODO: check if owner is requesting and/or public=true
    AnonChecklist.findById(req.params.cId)
      .populate("documentTags")
      .exec((err, checklist) => {
        return err ? next(err) : res.status(200).json(checklist);
      });
  }

  public static getByUser(req: Request, res: Response, next: NextFunction): void | Response {
    // TODO: check if owner is requesting
    Checklist.find({ owner: req.params.uId }, (err: any, checklists: IChecklistModel[]) => {
      const clsts: object[] = checklists.map(clst => {
        return {
          id: clst._id,
          title: clst.documentTitle
        };
      });
      return err ? next(err) : res.status(200).json(clsts);
    });
  }

  public static post(req: Request, res: Response, next: NextFunction): Response {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }

    // matchedData returns only the subset of data validated by Express Validator
    const validatedReq = matchedData(req);

    const checklist = new Checklist({
      parentChecklist: req.body.parentChecklist,
      owner: req.body.owner,
      public: req.body.public,
      documentTitle: validatedReq.documentTitle,
      documentTags: req.body.documentTags,
      flexibleText: req.body.flexibleText,
      checklistTags: req.body.checklistTags,
      customCss: req.body.customCss,
      sections: req.body.sections
    });

    checklist.save(err => {
      if (err) {
        return next(err);
      } else {
        return res.status(200).json({
          success: "You have successfully created a new checklist.",
          checklistId: checklist._id
        });
      }
    });
  }

  public static put(req: Request, res: Response, next: NextFunction): void | Response {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }

    // matchedData returns only the subset of data validated by Express Validator
    const validatedReq = matchedData(req);

    // TODO: confirm submitter is authorized to update
    Checklist.findById(req.params.cId, (err, checklist) => {
      if (err) {
        return next(err);
      }

      // TODO: make more efficient, only set updated values
      checklist.set({
        parentChecklist: req.body.parentChecklist,
        owner: req.body.owner,
        public: req.body.public,
        documentTitle: validatedReq.documentTitle,
        documentTags: req.body.documentTags,
        flexibleText: req.body.flexibleText,
        checklistTags: req.body.checklistTags,
        customCss: req.body.customCss,
        sections: req.body.sections
      });

      checklist.save(err => {
        return err
          ? next(err)
          : res.status(200).json({
              success: "You have successfully updated your checklist.",
              checklistId: checklist._id
            });
      });
    });
  }

  public static use(req: Request, res: Response, next: NextFunction): void | Response {
    // TODO: confirm submitter is authorized to update
    Checklist.findById(req.params.cId, (err, checklist) => {
      if (err) {
        return next(err);
      }

      // TODO: make more efficient, only set updated values
      checklist.set({
        sections: req.body.sections
      });

      checklist.save(err => {
        return err
          ? next(err)
          : res.status(200).json({
              success: "You have successfully updated your checklist.",
              checklistId: checklist._id
            });
      });
    });
  }

  public static useAnon(req: Request, res: Response, next: NextFunction): void | Response {
    AnonChecklist.findById(req.params.cId, (err, checklist) => {
      if (err) {
        return next(err);
      }

      // TODO: make more efficient, only set updated values
      checklist.set({
        sections: req.body.sections
      });

      checklist.save(err => {
        return err
          ? next(err)
          : res.status(200).json({
              success: "You have successfully updated your checklist.",
              checklistId: checklist._id
            });
      });
    });
  }

  public static useCopy(req: Request, res: Response, next: NextFunction): void | Response {
    Checklist.findById(req.body.pendingCID, (err, checklist) => {
      if (err) {
        return next(err);
      }

      if (req.body.pendingUID) {
        const dupChecklist = new Checklist({
          parentChecklist: checklist.parentChecklist,
          owner: req.body.pendingUID,
          public: checklist.public,
          documentTitle: checklist.documentTitle,
          documentTags: checklist.documentTags,
          flexibleText: checklist.flexibleText,
          checklistTags: checklist.checklistTags,
          customCss: checklist.customCss,
          sections: resetChecklistItems(checklist.sections)
        });

        dupChecklist.save(err => {
          return err
            ? next(err)
            : res.status(200).json({
                success: "You have successfully copied the checklist.",
                newCID: dupChecklist._id
              });
        });
      } else {
        const anonChecklist = new AnonChecklist({
          parentChecklist: checklist.parentChecklist,
          public: checklist.public,
          documentTitle: checklist.documentTitle,
          documentTags: checklist.documentTags,
          flexibleText: checklist.flexibleText,
          checklistTags: checklist.checklistTags,
          customCss: checklist.customCss,
          sections: resetChecklistItems(checklist.sections)
        });

        anonChecklist.save(err => {
          return err
            ? next(err)
            : res.status(200).json({
                success: "You have successfully copied the checklist.",
                newCID: anonChecklist._id
              });
        });
      }
    });
  }

  public static delete(req: Request, res: Response, next: NextFunction): void | Response {
    // TODO: confirm submitter is authorized to delete
    Checklist.deleteOne({ _id: req.params.cId }, err => {
      return err
        ? next(err)
        : res.status(204).json({
            success: "You have successfully deleted your checklist."
          });
    });
  }
}

export function resetChecklistItems(sections: ISection[]): ISection[] {
  const sectionClone = [...sections];

  sectionClone.forEach(sect => {
    sect.checklistItems.forEach(item => {
      item.checked = false;
    });
  });

  return sectionClone;
}
