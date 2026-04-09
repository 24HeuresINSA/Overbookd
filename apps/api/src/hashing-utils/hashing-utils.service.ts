import { Injectable } from "@nestjs/common";
import { compare as bcryptCompare, hash as bcryptHash } from "bcrypt";

@Injectable()
export class HashingUtilsService {
  async hash(password: string): Promise<string> {
    const hash = await bcryptHash(password, 13);
    return hash;
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcryptCompare(password, hash);
  }
}
