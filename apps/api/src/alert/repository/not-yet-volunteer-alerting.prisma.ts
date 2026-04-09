import { VOLUNTEER } from "@overbookd/registration";
import { PERSONNE } from "@overbookd/team-constants";
import { User } from "@overbookd/user";
import { PrismaService } from "../../prisma.service";
import { NotYetVolunteerAlerting } from "../alert.service";

export class PrismaNotYetVolunteerAlerting implements NotYetVolunteerAlerting {
  constructor(private readonly prisma: PrismaService) {}

  async for(id: User["id"]): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
        registrationMembership: VOLUNTEER,
        teams: { none: { team: { code: PERSONNE } } },
      },
      select: { registrationMembership: true },
    });
    return user !== null;
  }
}
