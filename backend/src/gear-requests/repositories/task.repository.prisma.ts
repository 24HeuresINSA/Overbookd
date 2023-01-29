import { PrismaService } from 'src/prisma.service';
import { Task, TaskRepository } from '../gearRequests.service';

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
