import { Planning, PlanningEvent } from "@overbookd/assignment";
import { PrismaService } from "../../../prisma.service";
import { IProvidePeriod } from "@overbookd/period";
import { SELECT_PERIOD } from "./period.query";
import { EXISTS_AND_NOT_READY_TO_ASSIGN } from "./task.query";

type DatabaseAssignment = IProvidePeriod & {
  festivalTask: { name: string };
};

type DatabaseMobilization = IProvidePeriod & {
  ft: { name: string };
};

export class PrismaPlanning implements Planning {
  constructor(private readonly prisma: PrismaService) {}

  async for(volunteerId: number): Promise<PlanningEvent[]> {
    const [dbAssignments, dbMobilizations] = await Promise.all([
      this.prisma.assignment.findMany({
        where: { assignees: { some: { userId: volunteerId } } },
        select: {
          ...SELECT_PERIOD,
          festivalTask: { select: { name: true } },
        },
      }),
      this.prisma.festivalTaskMobilization.findMany({
        where: {
          volunteers: { some: { volunteerId } },
          ft: EXISTS_AND_NOT_READY_TO_ASSIGN,
        },
        select: { ...SELECT_PERIOD, ft: { select: { name: true } } },
      }),
    ]);

    const assignments = dbAssignments.map(toPlanningEventFromAssignment);
    const mobilizations = dbMobilizations.map(toPlanningEventFromMobilization);
    return [...assignments, ...mobilizations];
  }
}

function toPlanningEventFromAssignment(
  event: DatabaseAssignment,
): PlanningEvent {
  const { start, end, festivalTask } = event;
  return { start, end, task: festivalTask.name };
}

function toPlanningEventFromMobilization(
  event: DatabaseMobilization,
): PlanningEvent {
  const { start, end, ft } = event;
  return { start, end, task: ft.name };
}
