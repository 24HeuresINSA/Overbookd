import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import {
  JwtPayload,
  JwtUtil,
} from "../authentication/entities/jwt-util.entity";
import { PrismaService } from "../prisma.service";
import { retrievePermissions } from "../team/utils/permissions";
import { VolunteerAssignmentStat } from "./dto/assignment-stat.response.dto";
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
  SELECT_PERIOD_AND_CATEGORY,
  SELECT_USER_PERSONAL_DATA,
  SELECT_USER_PERSONAL_DATA_WITH_NOTE,
  hasPermission,
} from "./user.query";
import { Category } from "@overbookd/festival-event-constants";
import {
  BE_AFFECTED,
  HAVE_PERSONAL_ACCOUNT,
  MANAGE_ADMINS,
  MANAGE_USERS,
  PAY_CONTRIBUTION,
} from "@overbookd/permission";
import { PlanningEvent } from "@overbookd/assignment";
import { SELECT_PLANNING_EVENT } from "../assignment/common/repository/planning.query";
import { toPlanningEventFromAssignment } from "../assignment/common/repository/planning.prisma";
import { Period } from "@overbookd/time";
import { SELECT_TRANSACTIONS_FOR_BALANCE } from "../common/query/transaction.query";
import { Balance } from "@overbookd/personal-account";
import { SELECT_USER_IDENTIFIER } from "../common/query/user.query";
import { IS_NOT_DELETED } from "../common/query/not-deleted.query";
import {
  MinimalCharismaPeriod,
  SELECT_CHARISMA_PERIOD,
} from "../common/query/charisma.query";
import { Charisma } from "@overbookd/charisma";
import { DatabaseVolunteerAssignmentStat } from "../assignment/task-to-volunteer/repository/assignable-volunteer.query";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getById(
    id: number,
    currentUser?: JwtUtil,
  ): Promise<UserPersonalData | null> {
    const select =
      currentUser && currentUser.can(MANAGE_USERS)
        ? SELECT_USER_PERSONAL_DATA_WITH_NOTE
        : SELECT_USER_PERSONAL_DATA;

    const [user, charismaPeriods] = await Promise.all([
      this.prisma.user.findUnique({ where: { id }, select }),
      this.selectCharismaPeriods(),
    ]);
    return UserService.formatToPersonalData(user, charismaPeriods);
  }

  async getMyInformation({ id }: JwtPayload): Promise<MyUserInformation> {
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
    authorInformation: JwtPayload,
    profile: Partial<Profile>,
  ): Promise<MyUserInformation | null> {
    const [updatedUser, charismaPeriods] = await Promise.all([
      this.prisma.user.update({
        where: { id: authorInformation.id },
        data: profile,
        select: SELECT_MY_USER_INFORMATION,
      }),
      this.selectCharismaPeriods(),
    ]);
    return UserService.formatToMyInformation(updatedUser, charismaPeriods);
  }

  async approveEndUserLicenceAgreement({ id }: JwtPayload): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { hasApprovedEULA: true },
    });
  }

  async getVolunteers(): Promise<UserPersonalData[]> {
    const [volunteers, charismaPeriods] = await Promise.all([
      this.prisma.user.findMany({
        where: { ...IS_NOT_DELETED, ...hasPermission(BE_AFFECTED) },
        select: SELECT_USER_PERSONAL_DATA,
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

  async getVolunteerAssignments(volunteerId: number): Promise<PlanningEvent[]> {
    const assignments = await this.prisma.assignment.findMany({
      where: {
        assignees: { some: { userId: volunteerId } },
        festivalTask: IS_NOT_DELETED,
      },
      select: SELECT_PLANNING_EVENT,
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
    authorInformation: JwtPayload,
  ): Promise<UserPersonalData> {
    const author = new JwtUtil(authorInformation);

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

  async deleteUser(id: number, author: JwtUtil): Promise<void> {
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

  private async softDeleteUser(id: number, author: JwtUtil): Promise<void> {
    const teams = await this.getUserTeams(id);
    if (!this.canManageAdmins(teams, author)) {
      throw new UnauthorizedException("Tu ne peux pas gérer l'équipe admin");
    }
    Promise.all([
      this.prisma.user.updateMany({ where: { id }, data: { isDeleted: true } }),
      this.prisma.userTeam.deleteMany({ where: { userId: id } }),
    ]);
  }

  private canManageAdmins(teams: string[], author: JwtUtil) {
    return !teams.includes("admin") || author.can(MANAGE_ADMINS);
  }

  async getVolunteerAssignmentStats(
    volunteerId: number,
  ): Promise<VolunteerAssignmentStat[]> {
    const assignments = await this.prisma.assignment.findMany({
      where: {
        assignees: { some: { userId: volunteerId } },
        festivalTask: IS_NOT_DELETED,
      },
      select: SELECT_PERIOD_AND_CATEGORY,
    });
    return UserService.formatAssignmentStats(assignments);
  }

  static formatAssignmentStats(assignments: DatabaseVolunteerAssignmentStat[]) {
    const stats = assignments.reduce(
      (stats, { festivalTask, ...assignment }) => {
        const { category } = festivalTask;
        const durationToAdd = Period.init(assignment).duration.inMilliseconds;
        const previousDuration = stats.get(category)?.duration ?? 0;
        const duration = previousDuration + durationToAdd;
        stats.set(category, { category, duration });
        return stats;
      },
      new Map<Category, VolunteerAssignmentStat>(),
    );
    return [...stats.values()];
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
      membershipApplications,
      ...personalData
    } = user;

    return {
      ...this.formatToPersonalData(personalData, charismaPeriods),
      hasApprovedEULA,
      permissions: [...retrievePermissions(user.teams)],
      tasksCount: _count.assigned,
      balance: Balance.calculate({ transactionsFrom, transactionsTo }),
      membershipApplication: membershipApplications?.at(0)?.membership ?? null,
    };
  }

  private canUpdateUser(author: JwtUtil, targetUserId: number): boolean {
    return author.can(MANAGE_USERS) || author.id === targetUserId;
  }
}

function extractTeamCodes(teams: DatabaseTeamCode[]) {
  return teams.map((t) => t.team.code);
}
