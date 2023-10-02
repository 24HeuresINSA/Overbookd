import { Injectable } from "@nestjs/common";
import { IProvidePeriod } from "@overbookd/period";
import { PrismaService } from "../../src/prisma.service";
import { buildVolunteerDisplayName } from "../../src/utils/volunteer";
import { TaskRepository } from "./domain/planning";
import { JsonStoredTask } from "./domain/storedTask";

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
  private SELECT_TASK = {
    timeWindow: {
      select: {
        ft: {
          select: {
            id: true,
            description: true,
            name: true,
            location: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    },
    start: true,
    end: true,
  };

  private SELECT_ASSIGNMENT = {
    assignee: {
      select: {
        id: true,
        firstname: true,
        lastname: true,
      },
    },
    timeSpan: {
      select: {
        start: true,
        end: true,
        timeWindow: {
          select: {
            ftId: true,
          },
        },
      },
    },
  };

  constructor(private readonly prisma: PrismaService) {}

  async getVolunteerTasksInChronologicalOrder(
    volunteerId: number,
  ): Promise<JsonStoredTask[]> {
    const tasks = await this.prisma.ftTimeSpan.findMany({
      where: { assignments: { some: { assigneeId: volunteerId } } },
      select: this.SELECT_TASK,
      orderBy: { start: "asc" },
    });
    const taskIds = tasks.map(({ timeWindow }) => timeWindow.ft.id);
    const assignments = await this.prisma.assignment.findMany({
      where: {
        timeSpan: { timeWindow: { ftId: { in: taskIds } } },
        NOT: { assigneeId: volunteerId },
      },
      select: this.SELECT_ASSIGNMENT,
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
}
