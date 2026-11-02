import { IProvidePeriod } from "@overbookd/time";
import { Volunteer } from "../../volunteer.js";

export type VolunteerForAssignment = {
  id: Volunteer["id"];
  teams: string[];
  availabilities: IProvidePeriod[];
  assignments: IProvidePeriod[];
  breakPeriods: IProvidePeriod[];
};

export type VolunteersForAssignmentRepository = {
  findOne(volunteerId: Volunteer["id"]): Promise<VolunteerForAssignment>;
};
