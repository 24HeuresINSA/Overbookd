import {
  FestivalTaskDraft,
  FestivalTasksForCreate,
} from "@overbookd/festival-event";
import { PrismaService } from "../../../prisma.service";
import {
  FestivalTaskQueryBuilder,
  SELECT_FESTIVAL_TASK,
} from "./festival-task.query";
import { DraftBuilder } from "./festival-task.builder";

export class PrismaCreateFestivalTasks implements FestivalTasksForCreate {
  constructor(private readonly prisma: PrismaService) {}

  async add(task: FestivalTaskDraft): Promise<FestivalTaskDraft> {
    const saved = await this.prisma.festivalTask.create({
      select: SELECT_FESTIVAL_TASK,
      data: FestivalTaskQueryBuilder.create(task),
    });
    return DraftBuilder.fromDatabase(saved).festivalTask;
  }
}
