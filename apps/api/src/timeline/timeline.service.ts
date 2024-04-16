import { Injectable } from "@nestjs/common";
import { IProvidePeriod } from "@overbookd/period";
import { PrismaService } from "../../src/prisma.service";
import { TimelineEvent } from "@overbookd/http";

type DatabaseMobilization = IProvidePeriod & {
  assignments: IProvidePeriod[];
};

type DatabaseTask = {
  id: number;
  name: string;
  mobilizations: DatabaseMobilization[];
  topPriority: boolean;
};

type DatabaseTimeline = {
  id: number;
  name: string;
  teamCode: string;
  festivalTasks: DatabaseTask[];
};

@Injectable()
export class TimelineService {
  constructor(private prisma: PrismaService) {}

  async getTimelines(period: IProvidePeriod): Promise<TimelineEvent[]> {
    const where = this.buildTimelineCondition(period);
    const select = this.buildTimelineSelection(period);

    const timelines = await this.prisma.festivalActivity.findMany({
      where,
      select,
    });
    return formatTimelines(timelines);
  }

  private buildTimelineSelection(period: IProvidePeriod) {
    const ftsSelection = this.buildTasksSelection(period);
    const ftsCondition = this.buildTasksCondition(period);

    return {
      id: true,
      name: true,
      teamCode: true,
      festivalTasks: {
        select: ftsSelection,
        where: ftsCondition,
      },
    };
  }

  private buildTimelineCondition(period: IProvidePeriod) {
    const tasksCondition = this.buildTasksCondition(period);
    return { festivalTasks: { some: tasksCondition } };
  }

  private buildTasksSelection(period: IProvidePeriod) {
    const mobilizationSelection =
      this.buildMobilizationsWithAssignmentsSelection(period);

    return {
      id: true,
      name: true,
      topPriority: true,
      ...mobilizationSelection,
    };
  }

  private buildMobilizationsWithAssignmentsSelection(period: IProvidePeriod) {
    const overlapPeriodCondition = this.buildOverlapPeriodCondition(period);
    return {
      mobilizations: {
        where: overlapPeriodCondition,
        select: {
          start: true,
          end: true,
          assignments: {
            where: overlapPeriodCondition,
            select: {
              start: true,
              end: true,
            },
          },
        },
      },
    };
  }

  private buildTasksCondition(period: IProvidePeriod) {
    const overlapPeriodCondition = this.buildOverlapPeriodCondition(period);
    return {
      mobilizations: {
        some: {
          assignments: { some: overlapPeriodCondition },
        },
      },
    };
  }

  private buildOverlapPeriodCondition({ start, end }: IProvidePeriod) {
    return { start: { lt: end }, end: { gt: start } };
  }
}

function formatTimelines(timelines: DatabaseTimeline[]): TimelineEvent[] {
  return timelines.map(formatTimeline);
}

function formatTimeline(timeline: DatabaseTimeline): TimelineEvent {
  return {
    activity: {
      id: timeline.id,
      name: timeline.name,
      team: timeline.teamCode,
    },
    tasks: timeline.festivalTasks,
  };
}
