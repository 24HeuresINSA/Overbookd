import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import {
  FaTimeWindow,
  FaTimeWindowWithOptionalId,
} from "./fa-time-window.model";

const SELECT_TIME_WINDOW = {
  id: true,
  start: true,
  end: true,
};

@Injectable()
export class FaTimeWindowService {
  constructor(private prisma: PrismaService) {}
  async upsert(
    faId: number,
    timeWindow: FaTimeWindowWithOptionalId,
  ): Promise<FaTimeWindow> {
    const timeWindowToUpdate = { ...timeWindow, faId };

    return this.prisma.faTimeWindow.upsert({
      where: { id: timeWindow?.id ?? -1 },
      create: timeWindowToUpdate,
      update: timeWindowToUpdate,
      select: SELECT_TIME_WINDOW,
    });
  }

  async remove(faId: number, id: number): Promise<void> {
    await this.prisma.faTimeWindow.deleteMany({
      where: {
        AND: [{ id }, { faId }],
      },
    });
  }
}
