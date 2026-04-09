import {
  DraftWithoutConflicts,
  FestivalTasksForCreate,
} from "@overbookd/festival-event";
import { PrismaService } from "../../../../prisma.service";
import { DraftBuilder } from "./festival-task.builder";
import {
  FestivalTaskQueryBuilder,
  SELECT_FESTIVAL_TASK,
} from "./festival-task.query";

export class PrismaCreateFestivalTasks implements FestivalTasksForCreate {
  constructor(private readonly prisma: PrismaService) {}

  async add(task: DraftWithoutConflicts): Promise<DraftWithoutConflicts> {
    const saved = await this.prisma.festivalTask.create({
      select: SELECT_FESTIVAL_TASK,
      data: FestivalTaskQueryBuilder.create(task),
    });
    return DraftBuilder.fromDatabase(saved).festivalTask;
  }
}
