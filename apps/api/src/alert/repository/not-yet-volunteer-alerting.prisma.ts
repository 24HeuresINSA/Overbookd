import { PrismaService } from "../../prisma.service";
import { User } from "@overbookd/user";
import { NotYetVolunteerAlerting } from "../alert.service";
import { VOLUNTEER } from "@overbookd/registration";
import { BENEVOLE_CODE } from "@overbookd/team-constants";

export class PrismaNotYetVolunteerAlerting implements NotYetVolunteerAlerting {
  constructor(private readonly prisma: PrismaService) {}

  async for(id: User["id"]): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
        registrationMembership: VOLUNTEER,
        teams: { none: { team: { code: BENEVOLE_CODE } } },
      },
      select: { registrationMembership: true },
    });
    return user !== null;
  }
}
