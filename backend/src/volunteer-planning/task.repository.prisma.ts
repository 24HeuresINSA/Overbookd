import { PrismaService } from 'src/prisma.service';
import { TaskRepository } from './domain/planning';
import { JsonStoredTask } from './domain/storedTask';
import { Injectable } from '@nestjs/common';

type DatabaseStoredTask = {
  start: Date;
  end: Date;
  assignments: { id: number }[];
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
    assignments: {
      select: { id: true },
    },
    start: true,
    end: true,
  };

  constructor(private readonly prismaService: PrismaService) {}

  async getVolunteerTasksInChronologicalOrder(
    volunteerId: number,
  ): Promise<JsonStoredTask[]> {
    const tasks = await this.prismaService.ftTimespan.findMany({
      where: { assignments: { some: { assigneeId: volunteerId } } },
      select: this.SELECT_TASK,
      orderBy: { start: 'asc' },
    });

    return tasks.map((task) => this.formatTask(task));
  }

  private formatTask(task: DatabaseStoredTask): JsonStoredTask {
    const { name, description, id, location } = task.timeWindow.ft;
    const period = { start: task.start, end: task.end };
    return {
      name,
      description,
      id,
      period,
      location: location.name,
      assignees: task.assignments,
    };
  }
}
