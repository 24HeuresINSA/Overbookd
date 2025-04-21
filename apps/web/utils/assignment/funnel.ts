import { CandidateFactory, type Assignments } from "@overbookd/assignment";
import { AssignmentsRepository } from "~/repositories/assignment/assignments.repository";
import { AvailabilitiesRepository } from "~/repositories/assignment/availabilities.repository";
import { BreakPeriodsRepository } from "~/repositories/assignment/break-periods.repository";
import { FriendsRepository } from "~/repositories/assignment/friends.repository";
import { AssignmentPlanningRepository } from "~/repositories/assignment/planning.repository";

export function candidateFactory(): CandidateFactory {
  const planning = new AssignmentPlanningRepository();
  const availabilities = new AvailabilitiesRepository();
  const breakPeriods = new BreakPeriodsRepository();
  const friends = new FriendsRepository();
  const agendas = { planning, availabilities, breakPeriods };
  return new CandidateFactory(agendas, friends);
}

export function assignments(): Assignments {
  return new AssignmentsRepository();
}
