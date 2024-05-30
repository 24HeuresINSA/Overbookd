import { Assignments, CandidateFactory } from "@overbookd/assignment";
import { AssignmentsRepository } from "~/repositories/assignment/assignments.repository";
import { AvailabilitiesRepository } from "~/repositories/assignment/availabilities.repository";
import { BreakPeriodsRepository } from "~/repositories/assignment/break-periods.repository";
import {
  FriendsRepository,
  FriendsRepositoryContext,
} from "~/repositories/assignment/friends.repository";
import { PlanningRepository } from "~/repositories/assignment/planning.repository";

type Context = FriendsRepositoryContext;

export function candidateFactory(context: Context): CandidateFactory {
  const planning = new PlanningRepository(context);
  const availabilities = new AvailabilitiesRepository(context);
  const breakPeriods = new BreakPeriodsRepository(context);
  const friends = new FriendsRepository(context);
  const agendas = { planning, availabilities, breakPeriods };
  return new CandidateFactory(agendas, friends);
}

export function assignments(context: Context): Assignments {
  return new AssignmentsRepository(context);
}
