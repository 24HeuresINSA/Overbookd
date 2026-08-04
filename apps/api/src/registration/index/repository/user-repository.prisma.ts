import { SELECT_USER_NAME } from "../../../common/query/user.query";
import { PrismaService } from "../../../prisma.service";
import { SELECT_USER_TEAMS } from "../../../user/user.query";
import { UserForRegistrationRepository } from "../registration.service";
import { RegistrationFormStepUser } from "@overbookd/http";
import {
  REGISTRATION_TEAM_CODES,
  RegistrationTeamCode,
} from "@overbookd/registration";

export class PrismaUserForRegistrationRepository implements UserForRegistrationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getByEmail(email: string): Promise<RegistrationFormStepUser> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        ...SELECT_USER_NAME,
        ...SELECT_USER_TEAMS,
        email: true,
        phoneNumber: true,
        birthDate: true,
        comment: true,
      },
    });
    if (!user) return undefined;
    return {
      ...user,
      teams: user.teams.filter((team) =>
        REGISTRATION_TEAM_CODES.includes(team as RegistrationTeamCode),
      ),
    };
  }
}
