import { BadRequestException } from "@nestjs/common";
import { TaskStatus } from "./task.model";

export class TaskAlreadyValidatedError extends BadRequestException {
  constructor(taskId: number, status: TaskStatus) {
    const message = `Task #${taskId} already ${status.toLowerCase()}, you can't add gear request`;
    super(message);
  }
}
