import { Injectable } from "@nestjs/common";
import { Preference } from "@overbookd/http";
import { JwtPayload } from "../authentication/entities/jwt-util.entity";

export type Preferences = {
  findOne(userId: number): Promise<Preference>;
  save(userId: number, preference: Preference): Promise<Preference>;
};

@Injectable()
export class PreferenceService {
  constructor(private readonly preferences: Preferences) {}

  findOne(userId: number): Promise<Preference> {
    return this.preferences.findOne(userId);
  }

  update({ userId }: JwtPayload, preference: Preference): Promise<Preference> {
    return this.preferences.save(userId, preference);
  }
}
