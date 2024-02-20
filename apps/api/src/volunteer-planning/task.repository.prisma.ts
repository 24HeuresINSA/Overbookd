import { Injectable } from "@nestjs/common";
import { PlanningTask } from "@overbookd/http";
import { IProvidePeriod } from "@overbookd/period";
import { PrismaService } from "../../src/prisma.service";
import { buildVolunteerDisplayName } from "../../src/utils/volunteer";
import { TaskRepository } from "./domain/planning";
import { JsonStoredTask } from "./domain/storedTask";

const SELECT_LEGACY_TASK = {
  timeWindow: {
    select: {
      ft: {
        select: {
          id: true,
          description: true,
          name: true,
          location: { select: { name: true } },
        },
      },
    },
  },
  start: true,
  end: true,
};

const SELECT_LEGACY_ASSIGNMENT = {
  assignee: {
    select: { id: true, firstname: true, lastname: true },
  },
  timeSpan: {
    select: {
      start: true,
      end: true,
      timeWindow: { select: { ftId: true } },
    },
  },
};

const SELECT_LOCATION = { id: true, name: true };
const SELECT_FESTIVAL_TASK = {
  id: true,
  name: true,
  status: true,
  appointment: { select: SELECT_LOCATION },
};
const SELECT_MOBILIZATION = {
  id: true,
  start: true,
  end: true,
  ft: {
    select: SELECT_FESTIVAL_TASK,
  },
};

const IS_NOT_DELETED = { isDeleted: false };

type DatabaseStoredTask = {
  start: Date;
  end: Date;
  timeWindow: {
    ft: {
      id: number;
      name: string;
      description: string;
      location: {
        name: string;
      };
    };
  };
};

type DatabaseAssignment = {
  timeSpan: IProvidePeriod & { timeWindow: { ftId: number } };
  assignee: { id: number; firstname: string; lastname: string };
};

@Injectable()
export class PrismaTaskRepository implements TaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getVolunteerTasksInChronologicalOrder(
    volunteerId: number,
  ): Promise<JsonStoredTask[]> {
    const tasks = await this.prisma.ftTimeSpan.findMany({
      where: { assignments: { some: { assigneeId: volunteerId } } },
      select: SELECT_LEGACY_TASK,
      orderBy: { start: "asc" },
    });
    const taskIds = tasks.map(({ timeWindow }) => timeWindow.ft.id);
    const assignments = await this.prisma.assignment.findMany({
      where: {
        timeSpan: { timeWindow: { ftId: { in: taskIds } } },
        NOT: { assigneeId: volunteerId },
      },
      select: SELECT_LEGACY_ASSIGNMENT,
      orderBy: { timeSpan: { start: "asc" } },
    });

    return tasks.map((task) => this.formatTask(task, assignments));
  }

  private formatTask(
    task: DatabaseStoredTask,
    assignments: DatabaseAssignment[],
  ): JsonStoredTask {
    const { name, description, id, location } = task.timeWindow.ft;
    const assignees = assignments
      .filter(({ timeSpan }) => timeSpan.timeWindow.ftId === id)
      .map(({ timeSpan: { start, end }, assignee }) => {
        const name = buildVolunteerDisplayName(assignee);
        return {
          period: { start, end },
          id: assignee.id,
          name,
        };
      });
    const period = { start: task.start, end: task.end };
    return {
      name,
      description,
      id,
      period,
      location: location.name,
      assignees,
    };
  }

  async getVolunteerTasksHeIsPartOf(
    volunteerId: number,
  ): Promise<PlanningTask[]> {
    const volunteerIsPartOfMobilization = {
      volunteers: { some: { volunteerId } },
    };

    const mobilizations = await this.prisma.festivalTaskMobilization.findMany({
      where: { ...volunteerIsPartOfMobilization, ft: IS_NOT_DELETED },
      select: SELECT_MOBILIZATION,
    });

    return mobilizations.map(({ ft, ...timeWindow }) => {
      return { ...ft, timeWindow };
    });
  }
}
