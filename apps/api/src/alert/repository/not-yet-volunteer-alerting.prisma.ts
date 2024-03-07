import { PrismaService } from "../../prisma.service";
import { User } from "@overbookd/user";
import { NotYetVolunteerAlerting } from "../alert.service";
import { VOLUNTEER } from "@overbookd/registration";

export class PrismaNotYetVolunteerAlerting implements NotYetVolunteerAlerting {
  constructor(private readonly prisma: PrismaService) {}

  async for(id: User["id"]): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
        registrationMembership: VOLUNTEER,
        teams: { none: { team: { code: "benevole" } } },
      },
      select: { registrationMembership: true },
    });
    return !!user;
  }
}
