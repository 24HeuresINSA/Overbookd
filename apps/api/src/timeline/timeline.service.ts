import { Injectable } from "@nestjs/common";
import { IProvidePeriod } from "@overbookd/period";
import { PrismaService } from "../../src/prisma.service";
import {
  TimelineAssignment,
  TimelineEvent,
  TimelineMobilization,
  TimelineTask,
} from "@overbookd/http";
import { SELECT_PERIOD } from "../common/query/period.query";
import { SELECT_TEAMS_CODE } from "../common/query/user.query";

type DatabaseAssignment = IProvidePeriod & {
  assignees: {
    personalData: {
      firstname: string;
      lastname: string;
      phone: string;
      teams: { teamCode: string }[];
    };
    as?: { teamCode: string };
  }[];
};

type DatabaseMobilization = IProvidePeriod & {
  assignments: DatabaseAssignment[];
};

type DatabaseTask = {
  id: number;
  name: string;
  mobilizations: DatabaseMobilization[];
  topPriority: boolean;
  appointment: { name: string };
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
    const tasksSelection = this.buildTasksSelection(period);
    const tasksCondition = this.buildTasksCondition(period);

    return {
      id: true,
      name: true,
      teamCode: true,
      festivalTasks: {
        select: tasksSelection,
        where: tasksCondition,
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
      appointment: { select: { name: true } },
      ...mobilizationSelection,
    };
  }

  private buildMobilizationsWithAssignmentsSelection(period: IProvidePeriod) {
    const overlapPeriodCondition = this.buildOverlapPeriodCondition(period);
    const selectAssignee = {
      personalData: {
        select: {
          firstname: true,
          lastname: true,
          phone: true,
          ...SELECT_TEAMS_CODE,
        },
      },
      as: true,
    };

    return {
      mobilizations: {
        where: overlapPeriodCondition,
        select: {
          ...SELECT_PERIOD,
          assignments: {
            where: overlapPeriodCondition,
            select: {
              ...SELECT_PERIOD,
              assignees: { select: selectAssignee },
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
    tasks: timeline.festivalTasks.map(formatTask),
  };
}

function formatTask(task: DatabaseTask): TimelineTask {
  return {
    id: task.id,
    name: task.name,
    appointment: task.appointment.name,
    mobilizations: task.mobilizations.map(formatMobilization),
    topPriority: task.topPriority,
  };
}

function formatMobilization(
  mobilization: DatabaseMobilization,
): TimelineMobilization {
  return {
    start: mobilization.start,
    end: mobilization.end,
    assignments: mobilization.assignments.map(formatAssignment),
  };
}

function formatAssignment(assignment: DatabaseAssignment): TimelineAssignment {
  return {
    start: assignment.start,
    end: assignment.end,
    assignees: assignment.assignees.map((assignee) => ({
      firstname: assignee.personalData.firstname,
      lastname: assignee.personalData.lastname,
      phone: assignee.personalData.phone,
      teams: assignee.personalData.teams.map(({ teamCode }) => teamCode),
      as: assignee.as?.teamCode,
    })),
  };
}
