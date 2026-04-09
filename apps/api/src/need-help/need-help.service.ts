import { Injectable } from "@nestjs/common";
import { HelpingVolunteer } from "@overbookd/http";
import { IProvidePeriod } from "@overbookd/time";

export type HelpingVolunteers = {
  findAvailableOnPeriod(period: IProvidePeriod): Promise<HelpingVolunteer[]>;
};

@Injectable()
export class NeedHelpService {
  constructor(private readonly volunteers: HelpingVolunteers) {}

  getAvailableVolunteers(period: IProvidePeriod): Promise<HelpingVolunteer[]> {
    return this.volunteers.findAvailableOnPeriod(period);
  }
}
