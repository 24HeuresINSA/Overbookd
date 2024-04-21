import { Assignments, CandidateFactory } from "@overbookd/assignment";
import { AssignmentsRepository } from "~/repositories/assignment/assignments.repository";
import { AvailabilitiesRepository } from "~/repositories/assignment/availabilities.repository";
import { PlanningRepository } from "~/repositories/assignment/planning.repository";
import { Context } from "~/repositories/context";

export function candidateFactory(context: Context): CandidateFactory {
  const planning = new PlanningRepository(context);
  const availabilities = new AvailabilitiesRepository(context);
  return new CandidateFactory(planning, availabilities);
}

export function assignments(context: Context): Assignments {
  return new AssignmentsRepository(context);
}
