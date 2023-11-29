import { ForbiddenException, Injectable, Logger } from "@nestjs/common";
import {
  JwtPayload,
  JwtUtil,
} from "../authentication/entities/jwt-util.entity";
import { PrismaService } from "../prisma.service";
import { retrievePermissions } from "../team/utils/permissions";
import {
  formatAssignmentAsTask,
  formatRequirementAsTask,
} from "../utils/assignment";
import { getPeriodDuration } from "../utils/duration";
import { VolunteerAssignmentStat } from "./dto/volunteer-assignment-stat.response.dto";
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
  VolunteerTask,
} from "./user.model";
import {
  ACTIVE_NOT_ASSIGNED_FT_CONDITION,
  SELECT_BASE_USER,
  SELECT_FT_USER_REQUESTS_BY_USER_ID,
  SELECT_MY_USER_INFORMATION,
  SELECT_TIMESPAN_PERIOD_WITH_CATEGORY,
  SELECT_USER_PERSONAL_DATA,
  SELECT_VOLUNTEER_ASSIGNMENTS,
  WHERE_HAVE_PERSONAL_ACCOUNT,
} from "./user.query";
import { TaskCategory } from "@prisma/client";
import { BE_AFFECTED, MANAGE_USERS } from "@overbookd/permission";
import { ForgetMember } from "@overbookd/registration";

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private forgetMember: ForgetMember,
  ) {}
  private logger = new Logger("UserService");

  async getById(id: number): Promise<UserPersonalData | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: SELECT_USER_PERSONAL_DATA,
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
      select: { password: true, isDeleted: false },
    });
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
        teams: {
          some: {
            team: {
              permissions: { some: { permissionName: BE_AFFECTED } },
            },
          },
        },
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
        ...WHERE_HAVE_PERSONAL_ACCOUNT,
      },
      select: SELECT_BASE_USER,
    });
  }

  async getAllPersonalAccountConsumers(): Promise<Consumer[]> {
    const users = await this.prisma.user.findMany({
      where: WHERE_HAVE_PERSONAL_ACCOUNT,
      select: { ...SELECT_USER_PERSONAL_DATA, balance: true },
    });
    return users.map(UserService.formatToConsumer);
  }

  async getFtUserRequestsByUserId(userId: number): Promise<VolunteerTask[]> {
    const ftTimeWindows = ACTIVE_NOT_ASSIGNED_FT_CONDITION;
    const userRequests = await this.prisma.ftUserRequest.findMany({
      where: { userId, ftTimeWindows },
      select: SELECT_FT_USER_REQUESTS_BY_USER_ID,
    });

    return userRequests.map(formatRequirementAsTask);
  }

  async getVolunteerAssignments(volunteerId: number): Promise<VolunteerTask[]> {
    const assignments = await this.prisma.assignment.findMany({
      where: { assigneeId: volunteerId },
      select: SELECT_VOLUNTEER_ASSIGNMENTS,
    });

    return assignments.map(formatAssignmentAsTask);
  }

  async getUserTeams(userId: number): Promise<string[]> {
    const teams = await this.prisma.team.findMany({
      select: { code: true },
      where: {
        users: {
          some: { userId },
        },
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

    return this.forgetMember.forgetHim(user.email);
  }

  async getVolunteerAssignmentStats(
    volunteerId: number,
  ): Promise<VolunteerAssignmentStat[]> {
    const assignments = await this.prisma.assignment.findMany({
      where: { assigneeId: volunteerId },
      select: SELECT_TIMESPAN_PERIOD_WITH_CATEGORY,
    });
    return UserService.formatAssignmentStats(assignments);
  }

  static formatAssignmentStats(assignments: DatabaseVolunteerAssignmentStat[]) {
    const stats = assignments.reduce((stats, { timeSpan }) => {
      const category = timeSpan.timeWindow.ft.category;
      const durationToAdd = getPeriodDuration(timeSpan);
      const previousDuration = stats.get(category)?.duration ?? 0;
      const duration = previousDuration + durationToAdd;
      stats.set(category, { category, duration });
      return stats;
    }, new Map<TaskCategory, VolunteerAssignmentStat>());
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
      tasksCount: _count.assignments,
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
    return {
      ...userData,
      charisma,
    };
  }
}

function extractTeamCodes(teams: DatabaseTeamCode[]) {
  return teams.map((t) => t.team.code);
}
