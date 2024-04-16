import { Injectable } from "@nestjs/common";
import { IProvidePeriod } from "@overbookd/period";
import { PrismaService } from "../../src/prisma.service";
import { TimelineEvent, TimelineTask } from "@overbookd/http";

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

  async getTimelines(start: Date, end: Date): Promise<TimelineEvent[]> {
    const where = this.buildTimelineCondition(start, end);
    const select = this.buildTimelineSelection(start, end);

    const timelines = await this.prisma.festivalActivity.findMany({
      where,
      select,
    });
    return formatTimelines(timelines);
  }

  private buildTimelineSelection(start: Date, end: Date) {
    const ftsSelection = this.buildTasksSelection(start, end);
    const ftsCondition = this.buildTasksCondition(start, end);

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

  private buildTimelineCondition(start: Date, end: Date) {
    const tasksCondition = this.buildTasksCondition(start, end);
    return { festivalTasks: { some: tasksCondition } };
  }

  private buildTasksSelection(start: Date, end: Date) {
    const mobilizationSelection =
      this.buildMobilizationsWithAssignmentsSelection(start, end);

    return {
      id: true,
      name: true,
      topPriority: true,
      ...mobilizationSelection,
    };
  }

  private buildMobilizationsWithAssignmentsSelection(start: Date, end: Date) {
    const overlapPeriodCondition = this.buildOverlapPeriodCondition(start, end);
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

  private buildTasksCondition(start: Date, end: Date) {
    const overlapPeriodCondition = this.buildOverlapPeriodCondition(start, end);
    return {
      mobilizations: {
        some: {
          assignments: { some: overlapPeriodCondition },
        },
      },
    };
  }

  private buildOverlapPeriodCondition(start: Date, end: Date) {
    return { start: { lt: end }, end: { gt: start } };
  }
}

function formatTimelines(timelines: DatabaseTimeline[]): TimelineEvent[] {
  return timelines.map(formatTimeline);
}

function formatTimeline(timeline: DatabaseTimeline): TimelineEvent {
  const tasks = formatTasks(timeline.festivalTasks);
  return {
    activity: {
      id: timeline.id,
      name: timeline.name,
      team: timeline.teamCode,
    },
    tasks: tasks,
  };
}

function formatTasks(tasks: DatabaseTask[]): TimelineTask[] {
  return tasks.map((task) => ({
    id: task.id,
    name: task.name,
    topPriority: task.topPriority,
    mobilizations: task.mobilizations,
  }));
}
