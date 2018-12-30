import { Request, Response } from "express";
import * as multer from "multer";
import * as fs from "fs";

export class UserImageController {
  public static imageMimeTypeMap = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/gif": "gif",
    "image/svg": "svg"
  };

  public static storage = multer.diskStorage({
    destination: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void
    ) => {
      const isValid = UserImageController.imageMimeTypeMap[file.mimetype];
      const error = isValid ? null : new Error("Invalid image file type");
      const dest =
        process.env.NODE_ENV === "dev"
          ? "src/public/user-images"
          : "public/user-images";

      console.log(
        "*** public/user-images ***",
        fs.existsSync("public/user-images")
      );
      console.log(
        "*** dist/public/user-images ***",
        fs.existsSync("dist/public/user-images")
      );

      cb(error, dest);
    },
    filename(
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void
    ): void {
      const name = file.originalname
        .toLowerCase()
        .split(" ")
        .join("-");
      const ext = UserImageController.imageMimeTypeMap[file.mimetype];
      cb(null, name + "-" + Date.now() + "." + ext);
    }
  });

  public static post(req: Request, res: Response): Response {
    console.log("req upload", req.file);
    if (!req.file) {
      return res.status(204).json({
        error: "Upload failed."
      });
    } else {
      return res.status(200).json({
        success: "File successfully uploaded.",
        imageFilePath: "user-images/" + req.file.filename
      });
    }
  }
}
