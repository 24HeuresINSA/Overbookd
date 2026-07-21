import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { retrievePermissions } from "../team/utils/permissions";
import {
  MyUserInformation,
  Profile,
  User,
  UserPersonalData,
  UserUpdateForm,
} from "@overbookd/user";
import {
  Consumer,
  DatabaseConsumer,
  DatabaseMyUserInformation,
  DatabaseTeamCode,
  DatabaseUserPersonalData,
  UserPasswordOnly,
} from "./user.model";
import {
  SELECT_MY_USER_INFORMATION,
  SELECT_USER_PERSONAL_DATA,
  SELECT_USER_PERSONAL_DATA_FOR_USER_MANAGER,
  hasPermission,
} from "./user.query";
import {
  BE_AFFECTED,
  HAVE_PERSONAL_ACCOUNT,
  MANAGE_USERS,
  PAY_CONTRIBUTION,
} from "@overbookd/permission";
import { AssignmentEvent } from "@overbookd/assignment";
import { SELECT_PLANNING_EVENT } from "../assignment/common/repository/planning.query";
import { toPlanningEventFromAssignment } from "../assignment/common/repository/planning.prisma";
import { SELECT_TRANSACTIONS_FOR_BALANCE } from "../common/query/transaction.query";
import { Balance } from "@overbookd/personal-account";
import { SELECT_USER_IDENTIFIER } from "../common/query/user.query";
import { IS_NOT_DELETED } from "../common/query/not-deleted.query";
import {
  MinimalCharismaPeriod,
  SELECT_CHARISMA_PERIOD,
} from "../common/query/charisma.query";
import { canManageAdmins } from "../team/team.utils";
import { Charisma } from "@overbookd/charisma";
import { ADMIN } from "@overbookd/team-constants";
import { friendAssigneesCount } from "../assignment/common/repository/assignment.query";
import { OidcRole, oidcRoles } from "@overbookd/oidc";
import { ZitadelService } from "./zitadel.service";
import { RequestHydratedUser } from "../authentication-zitadel/request-hydrated-user";

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private readonly zitadelService: ZitadelService,
  ) {}

  async userSync(user: RequestHydratedUser): Promise<void> {
    const userId =
      (await this.getUserByZitadelId(user.zitadelId))?.id ??
      (await this.getUserByEmail(user.email))?.id;

    const birthDate = user.birthDate ? { birthDate: user.birthDate } : {};
    const data = {
      email: user.email,
      firstName: user.givenName,
      lastName: user.familyName,
      phoneNumber: user.phoneNumber,
      zitadelId: user.zitadelId,
      ...birthDate,
    };

    if (!userId) {
      const newUser = await this.prisma.user.create({
        data,
        select: { id: true },
      });
      await this.updateAdminTeamFromZitadel(newUser.id, user.zitadelRoles);
      return;
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data,
      select: { birthDate: true },
    });
    await this.updateAdminTeamFromZitadel(userId, user.zitadelRoles);

    if (!user.birthDate && updatedUser.birthDate) {
      await this.zitadelService.updateMetadata(user.zitadelId, {
        dateOfBirth: updatedUser.birthDate,
      });
    }
  }

  private getUserByZitadelId(zitadelId: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: { zitadelId },
      select: SELECT_USER_IDENTIFIER,
    });
  }

  private getUserByEmail(email: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: { email },
      select: SELECT_USER_IDENTIFIER,
    });
  }

  private async updateAdminTeamFromZitadel(
    userId: number,
    zitadelRoles: OidcRole[],
  ): Promise<void> {
    const hasZitadelAdminRole = zitadelRoles.includes(oidcRoles.ADMIN);
    const hasAdminTeam = await this.prisma.userTeam.findFirst({
      where: { teamCode: ADMIN, userId },
    });
    if (hasZitadelAdminRole && !hasAdminTeam) {
      await this.prisma.userTeam.create({
        data: { userId, teamCode: ADMIN },
      });
      return;
    }
    if (!hasZitadelAdminRole && hasAdminTeam) {
      await this.prisma.userTeam.delete({
        where: { userId_teamCode: { userId, teamCode: ADMIN } },
      });
    }
  }

  async getById(
    id: number,
    currentUser?: RequestHydratedUser,
  ): Promise<UserPersonalData | null> {
    const select =
      currentUser && currentUser.can(MANAGE_USERS)
        ? SELECT_USER_PERSONAL_DATA_FOR_USER_MANAGER
        : SELECT_USER_PERSONAL_DATA;

    const [user, charismaPeriods] = await Promise.all([
      this.prisma.user.findUnique({ where: { id }, select }),
      this.selectCharismaPeriods(),
    ]);
    return UserService.formatToPersonalData(user, charismaPeriods);
  }

  async getMyInformation({
    id,
  }: RequestHydratedUser): Promise<MyUserInformation> {
    const [user, charismaPeriods] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id },
        select: SELECT_MY_USER_INFORMATION,
      }),
      this.selectCharismaPeriods(),
    ]);
    return UserService.formatToMyInformation(user, charismaPeriods);
  }

  async getUserPassword(email: string): Promise<UserPasswordOnly | null> {
    return this.prisma.user.findUnique({
      where: { email },
      select: { password: true },
    });
  }

  async isDeleted(email: string): Promise<boolean | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { isDeleted: true },
    });
    return user?.isDeleted ?? null;
  }

  async updateMyInformation(
    author: RequestHydratedUser,
    profile: Partial<Profile>,
  ): Promise<MyUserInformation | null> {
    const [updatedUser, charismaPeriods] = await Promise.all([
      this.prisma.user.update({
        where: { id: author.id },
        data: profile,
        select: SELECT_MY_USER_INFORMATION,
      }),
      this.selectCharismaPeriods(),
      this.zitadelService.updateMetadata(author.zitadelId, {
        dateOfBirth: profile.birthDate,
      }),
    ]);
    return UserService.formatToMyInformation(updatedUser, charismaPeriods);
  }

  async approveEndUserLicenceAgreement({
    id,
  }: RequestHydratedUser): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { hasApprovedEULA: true },
    });
  }

  async signVolunteerCharter({ id }: RequestHydratedUser): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { hasSignedVolunteerCharter: true },
    });
  }

  async getVolunteers(
    currentUser: RequestHydratedUser,
  ): Promise<UserPersonalData[]> {
    const select = currentUser.can(MANAGE_USERS)
      ? SELECT_USER_PERSONAL_DATA_FOR_USER_MANAGER
      : SELECT_USER_PERSONAL_DATA;
    const [volunteers, charismaPeriods] = await Promise.all([
      this.prisma.user.findMany({
        where: { ...IS_NOT_DELETED, ...hasPermission(BE_AFFECTED) },
        select: select,
        orderBy: { id: "asc" },
      }),
      this.selectCharismaPeriods(),
    ]);
    return volunteers.map((volunteer) =>
      UserService.formatToPersonalData(volunteer, charismaPeriods),
    );
  }

  getAdherents(): Promise<User[]> {
    return this.prisma.user.findMany({
      orderBy: { id: "asc" },
      where: { ...IS_NOT_DELETED, ...hasPermission(PAY_CONTRIBUTION) },
      select: SELECT_USER_IDENTIFIER,
    });
  }

  async getAllPersonalAccountConsumers(): Promise<Consumer[]> {
    const [consumers, charismaPeriods] = await Promise.all([
      this.prisma.user.findMany({
        where: { ...IS_NOT_DELETED, ...hasPermission(HAVE_PERSONAL_ACCOUNT) },
        select: {
          ...SELECT_USER_PERSONAL_DATA,
          ...SELECT_TRANSACTIONS_FOR_BALANCE,
        },
      }),
      this.selectCharismaPeriods(),
    ]);
    return consumers.map((consumer) =>
      UserService.formatToConsumer(consumer, charismaPeriods),
    );
  }

  async getVolunteerAssignments(
    volunteerId: number,
  ): Promise<AssignmentEvent[]> {
    const assignments = await this.prisma.assignment.findMany({
      where: {
        assignees: { some: { userId: volunteerId } },
        festivalTask: IS_NOT_DELETED,
      },
      select: {
        ...SELECT_PLANNING_EVENT,
        ...friendAssigneesCount(volunteerId),
      },
    });

    return assignments.map(toPlanningEventFromAssignment);
  }

  async getUserTeams(userId: number): Promise<string[]> {
    const teams = await this.prisma.team.findMany({
      select: { code: true },
      where: {
        users: { some: { userId } },
      },
    });
    return teams.map((t) => t.code);
  }

  async updateUser(
    targetId: number,
    userData: UserUpdateForm,
    author: RequestHydratedUser,
  ): Promise<UserPersonalData> {
    if (!this.canUpdateUser(author, targetId)) {
      throw new ForbiddenException("Tu ne peux pas modifier ce bénévole");
    }

    const [user, charismaPeriods] = await Promise.all([
      this.prisma.user.update({
        where: { id: targetId },
        select: SELECT_USER_PERSONAL_DATA,
        data: userData,
      }),
      this.selectCharismaPeriods(),
    ]);
    return UserService.formatToPersonalData(user, charismaPeriods);
  }

  async deleteUser(id: number, author: RequestHydratedUser): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { email: true },
    });
    if (!user) return;

    return this.softDeleteUser(id, author);
  }

  private async selectCharismaPeriods(): Promise<MinimalCharismaPeriod[]> {
    return this.prisma.charismaPeriod.findMany({
      select: SELECT_CHARISMA_PERIOD,
    });
  }

  private async softDeleteUser(
    id: number,
    author: RequestHydratedUser,
  ): Promise<void> {
    const teams = await this.getUserTeams(id);
    if (!canManageAdmins(teams, author)) {
      throw new UnauthorizedException("Tu ne peux pas gérer l'équipe admin");
    }
    Promise.all([
      this.prisma.user.updateMany({ where: { id }, data: { isDeleted: true } }),
      this.prisma.userTeam.deleteMany({ where: { userId: id } }),
    ]);
  }

  static formatToPersonalData(
    user: DatabaseUserPersonalData,
    charismaPeriods: MinimalCharismaPeriod[],
  ): UserPersonalData {
    const {
      teams,
      availabilities,
      charismaEventParticipations,
      preference,
      ...userWithoutTeams
    } = user;

    const charisma = Charisma.init()
      .addEvents(charismaEventParticipations)
      .addAvailabilities(availabilities, charismaPeriods)
      .calculate();
    return {
      ...userWithoutTeams,
      charisma,
      teams: extractTeamCodes(teams),
      preference: preference
        ? {
            assignment: preference.assignment,
          }
        : undefined,
    };
  }

  static formatToConsumer(
    user: DatabaseConsumer,
    charismaPeriods: MinimalCharismaPeriod[],
  ): Consumer {
    const { transactionsFrom, transactionsTo, ...personalData } = user;
    return {
      ...this.formatToPersonalData(personalData, charismaPeriods),
      balance: Balance.calculate({ transactionsFrom, transactionsTo }),
    };
  }

  static formatToMyInformation(
    user: DatabaseMyUserInformation,
    charismaPeriods: MinimalCharismaPeriod[],
  ): MyUserInformation {
    const {
      _count,
      transactionsFrom,
      transactionsTo,
      hasApprovedEULA,
      hasSignedVolunteerCharter,
      membershipApplications,
      ...personalData
    } = user;

    return {
      ...this.formatToPersonalData(personalData, charismaPeriods),
      hasApprovedEULA,
      hasSignedVolunteerCharter,
      permissions: retrievePermissions(user.teams),
      tasksCount: _count.assigned,
      balance: Balance.calculate({ transactionsFrom, transactionsTo }),
      membershipApplication: membershipApplications?.at(0)?.membership ?? null,
    };
  }

  private canUpdateUser(
    author: RequestHydratedUser,
    targetUserId: number,
  ): boolean {
    return author.can(MANAGE_USERS) || author.id === targetUserId;
  }
}

function extractTeamCodes(teams: DatabaseTeamCode[]) {
  return teams.map((t) => t.team.code);
}
