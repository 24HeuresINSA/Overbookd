import { PrismaService } from "../../prisma.service";
import { User } from "@overbookd/user";
import { HardAvailabilitiesAlerting } from "../alert.service";
import { OverDate } from "@overbookd/period";

export class PrismaHardAvailabilitiesAlerting
  implements HardAvailabilitiesAlerting
{
  constructor(private readonly prisma: PrismaService) {}

  async for(id: User["id"]): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
        teams: { some: { team: { code: "hard" } } },
      },
      select: { availabilities: true },
    });
    const startAvailabilitiesDate = OverDate.init({
      date: "2024-02-15",
      hour: 0,
    }).date;
    const endAvailabilitiesDate = OverDate.init({
      date: "2024-05-13",
      hour: 0,
    }).date;
    const now = OverDate.from(new Date()).date;
    return (
      user?.availabilities.length === 0 &&
      startAvailabilitiesDate <= now &&
      now <= endAvailabilitiesDate
    );
  }
}
