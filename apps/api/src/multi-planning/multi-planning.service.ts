import { Injectable } from "@nestjs/common";
import { MultiPlanningVolunteer } from "@overbookd/http";

export type MultiPlanningVolunteers = {
  findVolunteers(volunteerIds: number[]): Promise<MultiPlanningVolunteer[]>;
};

@Injectable()
export class MultiPlanningService {
  constructor(private readonly volunteers: MultiPlanningVolunteers) {}

  getVolunteers(volunteerIds: number[]): Promise<MultiPlanningVolunteer[]> {
    return this.volunteers.findVolunteers(volunteerIds);
  }
}
