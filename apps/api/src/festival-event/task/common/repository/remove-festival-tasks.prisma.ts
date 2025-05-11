import {
  FestivalTask,
  FestivalTasksForRemoval,
} from "@overbookd/festival-event";
import { PrismaService } from "../../../../prisma.service";
import { buildFestivalTaskCondition } from "./festival-task.query";

export class PrismaFestivalTasksForRemoval implements FestivalTasksForRemoval {
  constructor(private readonly prisma: PrismaService) {}

  async findStatus(
    id: FestivalTask["id"],
  ): Promise<FestivalTask["status"] | null> {
    const task = await this.prisma.festivalTask.findUnique({
      where: buildFestivalTaskCondition(id),
      select: { status: true },
    });
    return task?.status ?? null;
  }

  async one(id: FestivalTask["id"]): Promise<void> {
    await this.prisma.festivalTask.update({
      where: buildFestivalTaskCondition(id),
      data: { isDeleted: true },
    });
  }
}
