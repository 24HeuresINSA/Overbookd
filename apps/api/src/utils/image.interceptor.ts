import { BadRequestException } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { IMAGE_EXTENSIONS, IMAGE_MAX_SIZE } from "@overbookd/http";
import { randomUUID } from "crypto";
import { diskStorage } from "multer";
import { join } from "path";

export const ImageInterceptor = (fieldName: string) =>
  FileInterceptor(fieldName, {
    storage: diskStorage({
      destination: join(process.cwd(), "public"),
      filename: (_req, file, callback) => {
        const uuid = randomUUID();
        const filenameFragments = file.originalname.split(".");
        const extension = filenameFragments.at(-1) ?? "jpg";
        callback(null, `${uuid}.${extension}`);
      },
    }),
    limits: { fileSize: IMAGE_MAX_SIZE },
    fileFilter: (_req, file, callback) => {
      const isImage = IMAGE_EXTENSIONS.includes(file.mimetype);
      if (!isImage)
        return callback(new BadRequestException("Invalid file type"), false);
      callback(null, true);
    },
  });
