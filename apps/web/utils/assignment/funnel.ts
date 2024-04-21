import { Assignments, CandidateFactory } from "@overbookd/assignment";
import { AssignmentsRepository } from "~/repositories/assignment/assignments.repository";
import { PlanningRepository } from "~/repositories/assignment/planning.repository";
import { Context } from "~/repositories/context";

export function candidateFactory(context: Context): CandidateFactory {
  const planning = new PlanningRepository(context);
  return new CandidateFactory(planning);
}

export function assignments(context: Context): Assignments {
  return new AssignmentsRepository(context);
}