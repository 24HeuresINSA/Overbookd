import { PrismaService } from 'src/prisma.service';
import { TaskRepository } from './domain/planning';
import { JsonStoredTask } from './domain/storedTask';
import { Injectable } from '@nestjs/common';
import { Period } from 'src/volunteer-availability/domain/period.model';
import { buildVolunteerDisplayName } from 'src/utils/volunteer';

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
  timeSpan: Period & { timeWindow: { ftId: number } };
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

  constructor(private readonly prismaService: PrismaService) {}

  async getVolunteerTasksInChronologicalOrder(
    volunteerId: number,
  ): Promise<JsonStoredTask[]> {
    const tasks = await this.prismaService.ftTimeSpan.findMany({
      where: { assignments: { some: { assigneeId: volunteerId } } },
      select: this.SELECT_TASK,
      orderBy: { start: 'asc' },
    });
    const taskIds = tasks.map(({ timeWindow }) => timeWindow.ft.id);
    const assignments = await this.prismaService.assignment.findMany({
      where: {
        timeSpan: { timeWindow: { ftId: { in: taskIds } } },
        NOT: { assigneeId: volunteerId },
      },
      select: this.SELECT_ASSIGNMENT,
      orderBy: { timeSpan: { start: 'asc' } },
    });

    return tasks.map((task) => this.formatTask(task, assignments));
  }

  private formatTask(
    task: DatabaseStoredTask,
    assignments: DatabaseAssignment[],
  ): JsonStoredTask {
    const { name, description, id, location } = task.timeWindow.ft;
    const assignees = assignments
      .filter(({ timeSpan: timespan }) => timespan.timeWindow.ftId === id)
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
