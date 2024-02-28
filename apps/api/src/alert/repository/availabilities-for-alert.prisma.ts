import { AvailabilitiesForAlert } from "@overbookd/volunteer-availability";
import { PrismaService } from "../../prisma.service";

export class PrismaAvailabilitiesForAlert implements AvailabilitiesForAlert {
  constructor(private readonly prisma: PrismaService) {}

  async getCountFor(volunteerId: number): Promise<number> {
    const volunteer = await this.prisma.user.findUnique({
      where: {
        id: volunteerId,
        teams: { none: { team: { code: "benevole" } } },
      },
      select: { availabilities: true },
    });
    return volunteer?.availabilities.length ?? -1;
  }
}
