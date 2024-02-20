import { Injectable } from "@nestjs/common";
import {
  FestivalActivity,
  PrepareFestivalActivity,
  PrepareSecurityUpdate,
} from "@overbookd/festival-event";

@Injectable()
export class SecuritySectionService {
  constructor(private readonly prepare: PrepareFestivalActivity) {}

  saveSecuritySection(
    id: FestivalActivity["id"],
    security: PrepareSecurityUpdate,
  ): Promise<FestivalActivity> {
    return this.prepare.updateSecuritySection(id, security);
  }
}
