import {
  Injectable,
  Logger,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { createReadStream, existsSync, unlink } from 'fs';
import { join } from 'path';

@Injectable()
export class FileService {
  private logger = new Logger(FileService.name);

  deleteFile(fileName: string): void {
    const filePath = join(process.cwd(), '/public', fileName);
    // eslint-disable-next-line security/detect-non-literal-fs-filename -- no user input can reach this line
    if (!existsSync(filePath)) return;
    // eslint-disable-next-line security/detect-non-literal-fs-filename -- no user input can reach this line
    return unlink(filePath, (err) => {
      if (err)
        this.logger.error(`Impossible to delete Profile Picture ${fileName}`);
    });
  }

  streamFile(fileName: string): StreamableFile {
    // eslint-disable-next-line security/detect-non-literal-fs-filename -- no user input reach this line
    const filePath = join(process.cwd(), '/public', fileName);
    // eslint-disable-next-line security/detect-non-literal-fs-filename -- no user input reach this line
    if (!existsSync(filePath)) {
      throw new NotFoundException('Profile picture not found');
    }
    // eslint-disable-next-line security/detect-non-literal-fs-filename -- no user input reach this line
    const file = createReadStream(filePath);
    return new StreamableFile(file);
  }
}
