import {
  FestivalTask,
  FestivalTaskReadyToAssign,
  FestivalTaskWithoutConflicts,
  FestivalTasksForEnableAssignment,
  ReadyToAssignWithoutConflicts,
} from "@overbookd/festival-event";
import { PrismaService } from "../../../../prisma.service";
import {
  FestivalTaskQueryBuilder,
  SELECT_FESTIVAL_TASK,
  buildFestivalTaskCondition,
} from "./festival-task.query";
import {
  FestivalTaskBuilder,
  ReadyToReviewBuilder,
} from "./festival-task.builder";

export class PrimsaEnableAssignmentFestivalTasks implements FestivalTasksForEnableAssignment {
  constructor(private readonly prisma: PrismaService) {}
  async findById(
    id: FestivalTask["id"],
  ): Promise<FestivalTaskWithoutConflicts | null> {
    const task = await this.prisma.festivalTask.findUnique({
      where: buildFestivalTaskCondition(id),
      select: SELECT_FESTIVAL_TASK,
    });
    if (!task) return null;
    return FestivalTaskBuilder.fromDatabase(task).festivalTask;
  }

  async save(
    task: FestivalTaskReadyToAssign,
  ): Promise<ReadyToAssignWithoutConflicts> {
    const readyToAssign = await this.prisma.festivalTask.update({
      where: buildFestivalTaskCondition(task.id),
      data: FestivalTaskQueryBuilder.enableAssignment(task),
      select: SELECT_FESTIVAL_TASK,
    });
    return ReadyToReviewBuilder.fromDatabase(readyToAssign).festivalTask;
  }
}
