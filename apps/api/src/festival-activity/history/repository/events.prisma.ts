import { Created } from "@overbookd/festival-activity";
import { Events } from "../history.service";
import { PrismaService } from "../../../prisma.service";
import { Prisma } from "@prisma/client";

const CREATED = "CREATED";

export class PrismaEvents implements Events {
  constructor(private readonly prisma: PrismaService) {}

  async save({ by, id, festivalActivity, at }: Created): Promise<void> {
    const data = {
      event: CREATED,
      instigatorId: by,
      faId: id,
      snapshot: festivalActivity as unknown as Prisma.JsonObject,
      at,
    } as const;

    await this.prisma.festivalActivityHistory.create({
      select: { id: true },
      data,
    });
  }
}
