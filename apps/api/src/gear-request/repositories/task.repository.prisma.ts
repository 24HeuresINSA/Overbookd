import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { TaskRepository } from "../gear-request.service";
import { Task } from "../tasks/task.model";

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
