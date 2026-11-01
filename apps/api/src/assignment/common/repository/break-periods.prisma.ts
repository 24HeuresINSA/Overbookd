import { AssignmentBreakPeriods, BreakPeriod } from "@overbookd/assignment";
import { PrismaService } from "../../../prisma.service";
import { SELECT_BREAK_PERIOD } from "../../../common/query/break-period.query";

export class PrismaBreakPeriods implements AssignmentBreakPeriods {
  constructor(private readonly prisma: PrismaService) {}

  async for(volunteer: number): Promise<BreakPeriod[]> {
    return this.prisma.breakPeriod.findMany({
      where: { volunteerId: volunteer },
      select: SELECT_BREAK_PERIOD,
    });
  }
}
