import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TaskRepository } from '../gearRequests.service';
import { Task } from '../tasks/task.model';

@Injectable()
export class PrismaTaskRepository implements TaskRepository {
  private readonly SELECT_TASK = {
    id: true,
    status: true,
    name: true,
  };

  constructor(private readonly prismaService: PrismaService) {}

  getTask(taskId: number): Promise<Task> {
    return this.prismaService.ft.findUnique({
      select: this.SELECT_TASK,
      where: { id: taskId },
    });
  }
}
