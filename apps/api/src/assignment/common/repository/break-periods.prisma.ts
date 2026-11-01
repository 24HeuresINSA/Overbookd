import { AssignmentBreakPeriods, BreakPeriod } from "@overbookd/assignment";
import { PrismaService } from "../../../prisma.service";
import { SELECT_PERIOD } from "../../../common/query/period.query";

const SELECT_BREAK_PERIOD = {
  name: true,
  ...SELECT_PERIOD,
};

export class PrismaBreakPeriods implements AssignmentBreakPeriods {
  constructor(private readonly prisma: PrismaService) {}

  async for(volunteer: number): Promise<BreakPeriod[]> {
    return this.prisma.breakPeriod.findMany({
      where: { volunteerId: volunteer },
      select: SELECT_BREAK_PERIOD,
    });
  }
}
