import { NotVolunteerPeriods } from "@overbookd/volunteer-availability";
import { PrismaService } from "../../prisma.service";

export class PrismaNotVolunteerPeriods implements NotVolunteerPeriods {
  constructor(private readonly prisma: PrismaService) {}

  async getNbPeriods(adherentId: number): Promise<number> {
    const notVolunteer = await this.prisma.user.findUnique({
      where: {
        id: adherentId,
        teams: { none: { team: { code: "benevole" } } },
      },
      select: { availabilities: true },
    });
    return notVolunteer.availabilities.length ?? -1;
  }
}
