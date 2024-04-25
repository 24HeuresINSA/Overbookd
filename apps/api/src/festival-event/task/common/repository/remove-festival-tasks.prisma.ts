import { FestivalActivity } from "@overbookd/festival-event";
import { PrismaService } from "../../../../prisma.service";
import { RemoveFestivalTasks } from "../festival-task-common.model";
import { buildFestivalTaskCondition } from "./festival-task.query";
import { READY_TO_ASSIGN } from "@overbookd/festival-event-constants";

export class PrismaRemoveFestivalTasks implements RemoveFestivalTasks {
  constructor(private readonly prisma: PrismaService) {}

  async apply(id: FestivalActivity["id"]): Promise<void> {
    await this.prisma.festivalTask.update({
      where: {
        ...buildFestivalTaskCondition(id),
        NOT: { status: READY_TO_ASSIGN },
      },
      data: { isDeleted: true },
    });
  }
}
