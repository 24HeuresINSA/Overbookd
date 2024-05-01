import { Breaks } from "@overbookd/planning";
import { PrismaService } from "../../../prisma.service";
import { Period } from "@overbookd/period";
import { SELECT_PERIOD } from "../../../assignment/common/repository/period.query";

export class PrismaBreaks implements Breaks {
  constructor(private readonly prisma: PrismaService) {}

  async of(volunteerId: number): Promise<Period[]> {
    const breaks = await this.prisma.breakPeriod.findMany({
      where: { volunteerId },
      select: SELECT_PERIOD,
    });
    return breaks.map(Period.init);
  }

  async save(volunteerId: number, breaks: Period[]): Promise<Period[]> {
    await this.prisma.breakPeriod.createMany({
      data: breaks.map(({ start, end }) => ({ start, end, volunteerId })),
      skipDuplicates: true,
    });

    return breaks;
  }

  async remove(volunteerId: number, { start, end }: Period): Promise<Period[]> {
    await this.prisma.breakPeriod.delete({
      where: { volunteerId_start_end: { volunteerId, start, end } },
      select: SELECT_PERIOD,
    });
    return this.of(volunteerId);
  }
}
