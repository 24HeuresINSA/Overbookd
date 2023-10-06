import { Contributions } from "@overbookd/contribution";
import { IDefineContribution } from "@overbookd/contribution/src/settle-alerting/settle-alerting";
import { PrismaClient } from "@prisma/client";

export class PrismaContributions implements Contributions {
  constructor(private readonly prisma: PrismaClient) {}

  mine(adherentId: number): Promise<IDefineContribution[]> {
    return this.prisma.contribution.findMany({
      select: { adherentId: true, edition: true },
      where: { adherentId },
    });
  }
}
