import { Planning, PlanningEvent } from "@overbookd/assignment";
import { PrismaService } from "../../../prisma.service";
import { IProvidePeriod } from "@overbookd/period";
import { SELECT_PERIOD } from "./period.query";

type DatabasePlanningEvent = IProvidePeriod & {
  festivalTask: { name: string };
};

export class PrismaPlanning implements Planning {
  constructor(private readonly prisma: PrismaService) {}

  async for(volunteerId: number): Promise<PlanningEvent[]> {
    const events = await this.prisma.assignment.findMany({
      where: { assignees: { some: { userId: volunteerId } } },
      select: {
        ...SELECT_PERIOD,
        festivalTask: { select: { name: true } },
      },
    });
    return events.map(toPlanningEvent);
  }
}

function toPlanningEvent(event: DatabasePlanningEvent): PlanningEvent {
  const { start, end, festivalTask } = event;
  return { start, end, task: festivalTask.name };
}
