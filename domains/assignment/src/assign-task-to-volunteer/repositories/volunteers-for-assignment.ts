import { IProvidePeriod } from "@overbookd/time";
import { BreakPeriod } from "../../break-periods/break-periods.js";
import { Volunteer } from "../../volunteer.js";

export type VolunteerForAssignment = {
  id: Volunteer["id"];
  teams: string[];
  availabilities: IProvidePeriod[];
  assignments: IProvidePeriod[];
  breakPeriods: BreakPeriod[];
};

export type VolunteersForAssignmentRepository = {
  findOne(volunteerId: Volunteer["id"]): Promise<VolunteerForAssignment>;
};
