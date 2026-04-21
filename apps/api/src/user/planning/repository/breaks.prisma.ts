import { Breaks, BreakPeriod } from "@overbookd/assignment";
import { PrismaService } from "../../../prisma.service";
import { SELECT_PERIOD } from "../../../common/query/period.query";

const SELECT_BREAK_PERIOD = {
  name: true,
  ...SELECT_PERIOD,
};

export class PrismaBreaks implements Breaks {
  constructor(private readonly prisma: PrismaService) {}

  async of(volunteerId: number): Promise<BreakPeriod[]> {
    return this.prisma.breakPeriod.findMany({
      where: { volunteerId },
      select: SELECT_BREAK_PERIOD,
    });
  }

  async save(
    volunteerId: number,
    breaks: BreakPeriod[],
  ): Promise<BreakPeriod[]> {
    await this.prisma.breakPeriod.createMany({
      data: breaks.map((breaks) => ({ ...breaks, volunteerId })),
      skipDuplicates: true,
    });
    return breaks;
  }

  async remove(
    volunteerId: number,
    { start, end }: BreakPeriod,
  ): Promise<BreakPeriod[]> {
    await this.prisma.breakPeriod.delete({
      where: { volunteerId_start_end: { volunteerId, start, end } },
      select: SELECT_BREAK_PERIOD,
    });
    return this.of(volunteerId);
  }
}
