import { PrismaService } from "../../prisma.service";
import { User } from "@overbookd/user";
import { NotYetVolunteerAlerting } from "../alert.service";
import { VOLUNTEER } from "@overbookd/registration";
import { PERSONNE } from "@overbookd/team-code";
import { Edition } from "@overbookd/time";

export class PrismaNotYetVolunteerAlerting implements NotYetVolunteerAlerting {
  constructor(private readonly prisma: PrismaService) {}

  async for(id: User["id"]): Promise<boolean> {
    const edition = Edition.current;
    const user = await this.prisma.user.findUnique({
      where: {
        id,
        membershipApplications: { some: { edition, membership: VOLUNTEER } },
        teams: { none: { team: { code: PERSONNE } } },
      },
      select: { id: true },
    });
    return user !== null;
  }
}
