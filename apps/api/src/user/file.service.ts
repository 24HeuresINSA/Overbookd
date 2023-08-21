/* eslint-disable security/detect-non-literal-fs-filename */
//On desactive la regle de securite car le nom du fichier vient de la base de donnees
//il n'est pas possible dans le workflow de l'application que le nom du fichier soit modifie
//par un utilisateur externe
import {
  Injectable,
  Logger,
  NotFoundException,
  StreamableFile,
} from "@nestjs/common";
import { createReadStream, existsSync, unlink } from "fs";
import { join } from "path";

@Injectable()
export class FileService {
  private logger = new Logger(FileService.name);

  deleteFile(fileName: string): void {
    const filePath = join(process.cwd(), "/public/", fileName);
    // nosemgrep
    if (!existsSync(filePath)) return;
    // nosemgrep
    return unlink(filePath, (err) => {
      if (err)
        this.logger.error(`Impossible to delete Profile Picture ${fileName}`);
    });
  }

  streamFile(fileName: string): StreamableFile {
    const filePath = join(process.cwd(), "/public/", fileName);
    // nosemgrep
    if (!existsSync(filePath)) {
      throw new NotFoundException("Profile picture not found");
    }
    // nosemgrep
    const file = createReadStream(filePath);
    return new StreamableFile(file);
  }
}
