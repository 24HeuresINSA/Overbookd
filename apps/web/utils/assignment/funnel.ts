import { Assignments, CandidateFactory } from "@overbookd/assignment";
import { AssignmentsRepository } from "~/repositories/assignment/assignments.repository";
import { AvailabilitiesRepository } from "~/repositories/assignment/availabilities.repository";
import {
  FriendsRepository,
  FriendsRepositoryContext,
} from "~/repositories/assignment/friends.repository";
import { PlanningRepository } from "~/repositories/assignment/planning.repository";

type Context = FriendsRepositoryContext;

export function candidateFactory(context: Context): CandidateFactory {
  const planning = new PlanningRepository(context);
  const availabilities = new AvailabilitiesRepository(context);
  const friends = new FriendsRepository(context);
  return new CandidateFactory(planning, availabilities, friends);
}

export function assignments(context: Context): Assignments {
  return new AssignmentsRepository(context);
}
