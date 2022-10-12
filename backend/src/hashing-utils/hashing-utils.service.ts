import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashingUtilsService {
  async hash(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, 13);
    return hash;
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
