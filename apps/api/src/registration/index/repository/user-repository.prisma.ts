import { UserName } from "@overbookd/user";
import { SELECT_USER_NAME } from "../../../common/query/user.query";
import { PrismaService } from "../../../prisma.service";
import { extractTeamCodes } from "../../../team/team.utils";
import { SELECT_USER_TEAMS } from "../../../user/user.query";
import { UserForRegistrationRepository } from "../registration.service";
import { RegistrationFormStepUser } from "@overbookd/http";
import {
  RegistrationTeams,
  isRegistrationTeamCode,
} from "@overbookd/registration";
import { DatabaseTeamCode } from "../../../user/user.model";

const SELECT_USER = {
  ...SELECT_USER_NAME,
  ...SELECT_USER_TEAMS,
  email: true,
  phoneNumber: true,
  birthDate: true,
  comment: true,
};

type DatabaseUser = UserName & {
  email: string;
  phoneNumber: string;
  birthDate: Date;
  comment?: string;
  teams: DatabaseTeamCode[];
};

export class PrismaUserForRegistrationRepository implements UserForRegistrationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getZitadelIdByEmail(email: string): Promise<string | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { zitadelId: true },
    });
    return user?.zitadelId ?? null;
  }

  async getByEmail(email: string): Promise<RegistrationFormStepUser> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: SELECT_USER,
    });
    if (!user) return undefined;
    return this.formatUser(user);
  }

  async getById(id: number): Promise<RegistrationFormStepUser> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: SELECT_USER,
    });
    if (!user) return undefined;
    return this.formatUser(user);
  }

  async updateZitadelIdByEmail(
    email: string,
    zitadelId: string,
  ): Promise<void> {
    await this.prisma.user.update({
      where: { email },
      data: { zitadelId },
    });
  }

  private formatUser(user: DatabaseUser): RegistrationFormStepUser {
    const teamCodes = extractTeamCodes(user.teams);
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      nickname: user.nickname,
      email: user.email,
      birthDate: user.birthDate,
      comment: user.comment,
      mobilePhone: user.phoneNumber,
      teams: teamCodes.filter(isRegistrationTeamCode) as RegistrationTeams,
    };
  }
}
