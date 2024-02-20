import { FestivalActivity } from "@overbookd/festival-event";
import { PrismaService } from "../../../../prisma.service";
import { RemoveFestivalTasks } from "../festival-task-common.model";
import { buildFestivalTaskCondition } from "./festival-task.query";

export class PrismaRemoveFestivalTasks implements RemoveFestivalTasks {
  constructor(private readonly prisma: PrismaService) {}

  async apply(id: FestivalActivity["id"]): Promise<void> {
    await this.prisma.festivalTask.update({
      where: buildFestivalTaskCondition(id),
      data: { isDeleted: true },
    });
  }
}
