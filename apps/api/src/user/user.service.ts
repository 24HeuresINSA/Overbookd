import { ForbiddenException, Injectable } from "@nestjs/common";
import {
  JwtPayload,
  JwtUtil,
} from "../authentication/entities/jwt-util.entity";
import { PrismaService } from "../prisma.service";
import { retrievePermissions } from "../team/utils/permissions";
import { VolunteerAssignmentStat } from "./dto/assignment-stat.response.dto";
import { DatabaseVolunteerAssignmentStat } from "./volunteer-assignment.model";
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
  SELECT_BASE_USER,
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
  MANAGE_USERS,
  PAY_CONTRIBUTION,
} from "@overbookd/permission";
import { ForgetMember } from "@overbookd/registration";
import { PlanningEvent } from "@overbookd/assignment";
import { SELECT_PLANNING_EVENT } from "../assignment/common/repository/planning.query";
import { toPlanningEventFromAssignment } from "../assignment/common/repository/planning.prisma";
import { Period } from "@overbookd/period";

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private forgetMember: ForgetMember,
  ) {}

  async getById(
    id: number,
    currentUser?: JwtUtil,
  ): Promise<UserPersonalData | null> {
    const select =
      currentUser && currentUser.can(MANAGE_USERS)
        ? SELECT_USER_PERSONAL_DATA_WITH_NOTE
        : SELECT_USER_PERSONAL_DATA;

    const user = await this.prisma.user.findUnique({
      where: { id },
      select,
    });
    return UserService.formatToPersonalData(user);
  }

  async getMyInformation({ id }: JwtPayload): Promise<MyUserInformation> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: SELECT_MY_USER_INFORMATION,
    });
    return UserService.formatToMyInformation(user);
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
    const updatedUser = await this.prisma.user.update({
      where: { id: authorInformation.id },
      data: profile,
      select: SELECT_MY_USER_INFORMATION,
    });
    return UserService.formatToMyInformation(updatedUser);
  }

  async getAll(): Promise<UserPersonalData[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { id: "asc" },
      where: { isDeleted: false },
      select: SELECT_USER_PERSONAL_DATA,
    });
    return users.map(UserService.formatToPersonalData);
  }

  async getVolunteers(): Promise<UserPersonalData[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { id: "asc" },
      where: {
        isDeleted: false,
        ...hasPermission(BE_AFFECTED),
      },
      select: SELECT_USER_PERSONAL_DATA,
    });
    return users.map(UserService.formatToPersonalData);
  }

  getAdherents(): Promise<User[]> {
    return this.prisma.user.findMany({
      orderBy: { id: "asc" },
      where: {
        isDeleted: false,
        ...hasPermission(PAY_CONTRIBUTION),
      },
      select: SELECT_BASE_USER,
    });
  }

  async getAllPersonalAccountConsumers(): Promise<Consumer[]> {
    const users = await this.prisma.user.findMany({
      where: hasPermission(HAVE_PERSONAL_ACCOUNT),
      select: { ...SELECT_USER_PERSONAL_DATA, balance: true },
    });
    return users.map(UserService.formatToConsumer);
  }

  async getVolunteerAssignments(volunteerId: number): Promise<PlanningEvent[]> {
    const assignments = await this.prisma.assignment.findMany({
      where: {
        assignees: { some: { userId: volunteerId } },
        festivalTask: { isDeleted: false },
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

    const filteredPersonalData = this.filterUpdatableUserData(author, userData);

    const user = await this.prisma.user.update({
      select: SELECT_USER_PERSONAL_DATA,
      data: filteredPersonalData,
      where: { id: targetId },
    });
    return UserService.formatToPersonalData(user);
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { email: true },
    });
    if (!user) return;

    return this.softDeleteUser(id);
  }

  private async softDeleteUser(id: number): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  async getVolunteerAssignmentStats(
    volunteerId: number,
  ): Promise<VolunteerAssignmentStat[]> {
    const assignments = await this.prisma.assignment.findMany({
      where: {
        assignees: { some: { userId: volunteerId } },
        festivalTask: { isDeleted: false },
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
  ): UserPersonalData {
    const { teams, ...userWithoutTeams } = user;
    return {
      ...userWithoutTeams,
      teams: extractTeamCodes(teams),
    };
  }

  static formatToConsumer(user: DatabaseConsumer): Consumer {
    const { teams, ...userWithoutTeams } = user;
    return {
      ...userWithoutTeams,
      teams: extractTeamCodes(teams),
    };
  }

  static formatToMyInformation(
    user: DatabaseMyUserInformation,
  ): MyUserInformation {
    const teams = extractTeamCodes(user.teams);
    const permissions = retrievePermissions(user.teams);
    const { _count, ...userWithoutCount } = user;
    return {
      ...userWithoutCount,
      teams,
      permissions: [...permissions],
      tasksCount: _count.assigned,
    };
  }

  private canUpdateUser(author: JwtUtil, targetUserId: number): boolean {
    return author.can(MANAGE_USERS) || author.id === targetUserId;
  }

  private filterUpdatableUserData(
    author: JwtUtil,
    userData: UserUpdateForm,
  ): UserUpdateForm {
    const charisma = author.can(MANAGE_USERS) ? userData.charisma : undefined;
    return { ...userData, charisma };
  }
}

function extractTeamCodes(teams: DatabaseTeamCode[]) {
  return teams.map((t) => t.team.code);
}
