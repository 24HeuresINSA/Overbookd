import { Planning, PlanningEvent, PlanningTask } from "@overbookd/assignment";
import { PrismaService } from "../../../prisma.service";
import { IProvidePeriod } from "@overbookd/period";
import { SELECT_PERIOD } from "./period.query";
import { EXISTS_AND_NOT_READY_TO_ASSIGN } from "../../task-to-volunteer/repository/task.query";
import { SELECT_PLANNING_EVENT, SELECT_TASK } from "./planning.query";

type DatabaseAssignment = IProvidePeriod & {
  festivalTask: PlanningTask;
};

type DatabaseMobilization = IProvidePeriod & {
  ft: PlanningTask;
};

export class PrismaPlanning implements Planning {
  constructor(private readonly prisma: PrismaService) {}

  async for(volunteerId: number): Promise<PlanningEvent[]> {
    const [dbAssignments, dbMobilizations] = await Promise.all([
      this.prisma.assignment.findMany({
        where: { assignees: { some: { userId: volunteerId } } },
        select: SELECT_PLANNING_EVENT,
      }),
      this.prisma.festivalTaskMobilization.findMany({
        where: {
          volunteers: { some: { volunteerId } },
          ft: EXISTS_AND_NOT_READY_TO_ASSIGN,
        },
        select: { ...SELECT_PERIOD, ft: { select: SELECT_TASK } },
      }),
    ]);

    const assignments = dbAssignments.map(toPlanningEventFromAssignment);
    const mobilizations = dbMobilizations.map(toPlanningEventFromMobilization);
    return [...assignments, ...mobilizations];
  }
}

export function toPlanningEventFromAssignment(
  event: DatabaseAssignment,
): PlanningEvent {
  const { start, end, festivalTask } = event;
  return { start, end, task: festivalTask };
}

function toPlanningEventFromMobilization(
  event: DatabaseMobilization,
): PlanningEvent {
  const { start, end, ft } = event;
  return { start, end, task: ft };
}
