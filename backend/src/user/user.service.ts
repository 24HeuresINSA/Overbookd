import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { Ft, FtStatus, Prisma, TaskCategory, User } from '@prisma/client';
import { JwtUtil } from 'src/auth/entities/JwtUtil.entity';
import { Period } from 'src/volunteer-availability/domain/period.model';
import { HashingUtilsService } from '../hashing-utils/hashing-utils.service';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma.service';
import {
  TeamWithNestedPermissions,
  retrievePermissions,
} from '../team/utils/permissions';
import { UserCreationDto } from './dto/userCreation.dto';
import { UserModificationDto } from './dto/userModification.dto';
import { Username } from './dto/userName.dto';
import { VolunteerAssignmentStat } from './dto/volunteerAssignment.dto';
import { getPeriodDuration } from '../utils/duration';
import { DatabaseVolunteerAssignmentStat } from './types/volunteerAssignmentTypes';

const SELECT_USER = {
  email: true,
  firstname: true,
  lastname: true,
  nickname: true,
  id: true,
  birthdate: true,
  phone: true,
  department: true,
  comment: true,
  reset_password_token: true,
  reset_password_expires: true,
  has_payed_contributions: true,
  year: true,
  pp: true,
  charisma: true,
  balance: true,
  created_at: true,
  updated_at: true,
  is_deleted: true,
};

export const SELECT_USER_TEAMS = {
  team: {
    select: {
      team: {
        select: {
          code: true,
        },
      },
    },
  },
};

const SELECT_USER_TEAMS_AND_PERMISSIONS = {
  team: {
    select: {
      team: {
        select: {
          code: true,
          permissions: {
            select: {
              permission_name: true,
            },
          },
        },
      },
    },
  },
};

const SELECT_USER_TASKS_COUNT = {
  _count: {
    select: {
      assignments: true,
    },
  },
};

export const SELECT_USERNAME_WITH_ID = {
  id: true,
  firstname: true,
  lastname: true,
};

const SELECT_FT_USER_REQUESTS_BY_USER_ID = {
  ftTimeWindows: {
    select: {
      start: true,
      end: true,
      ft: {
        select: {
          id: true,
          name: true,
          status: true,
        },
      },
    },
  },
};

const SELECT_VOLUNTEER_ASSIGNMENTS = {
  timespan: {
    select: {
      start: true,
      end: true,
      timeWindow: {
        select: {
          ft: { select: { name: true, id: true, status: true } },
        },
      },
    },
  },
  timespanId: true,
};

const SELECT_TIMESPAN_PERIOD_WITH_CATEGORY = {
  timespan: {
    select: {
      start: true,
      end: true,
      timeWindow: {
        select: {
          ft: {
            select: {
              category: true,
            },
          },
        },
      },
    },
  },
};

export type UserWithoutPassword = Omit<User, 'password'>;

export type UserWithTeamAndPermission = UserWithoutPassword & {
  team: string[];
  permissions: string[];
};

export type MyUserInformation = UserWithTeamAndPermission & {
  tasksCount: number;
};

type DatabaseMyUserInformation = UserWithoutPassword & {
  team: TeamWithNestedPermissions[];
  _count: { assignments: number };
};

export type UserPasswordOnly = Pick<User, 'password'>;

export type VolunteerTask = Period & {
  ft: Pick<Ft, 'id' | 'name' | 'status'>;
  timespanId?: number;
};

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private mail: MailService) {}
  private logger = new Logger('UserService');

  async user(
    findCondition: Prisma.UserWhereUniqueInput & Prisma.UserWhereInput,
  ): Promise<MyUserInformation | null> {
    const user = await this.prisma.user.findUnique({
      where: findCondition,
      select: {
        ...SELECT_USER,
        ...SELECT_USER_TEAMS_AND_PERMISSIONS,
        ...SELECT_USER_TASKS_COUNT,
      },
    });
    return this.getMyUserInformation(user);
  }

  async getUserPassword(
    findCondition: Prisma.UserWhereUniqueInput,
  ): Promise<UserPasswordOnly | null> {
    return this.prisma.user.findUnique({
      where: findCondition,
      select: { password: true },
    });
  }

  async updateUserPersonnalData(
    id: number,
    user: Partial<UserModificationDto>,
  ): Promise<UserWithTeamAndPermission | null> {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: user,
      select: {
        ...SELECT_USER,
        ...SELECT_USER_TEAMS_AND_PERMISSIONS,
      },
    });
    return this.getUserWithTeamAndPermission(updatedUser);
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    select?: Prisma.UserSelect;
  }): Promise<UserWithTeamAndPermission[]> {
    const { skip, take, cursor, where } = params;
    //get all users with their teams
    const users = await this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy: { id: 'asc' },
      select: {
        ...SELECT_USER,
        ...SELECT_USER_TEAMS_AND_PERMISSIONS,
      },
    });
    return users.map((user) => this.getUserWithTeamAndPermission(user));
  }

  async getFtUserRequestsByUserId(userId: number): Promise<VolunteerTask[]> {
    const ftTimeWindows = {
      ft: { isDeleted: false, NOT: { status: FtStatus.READY } },
    };
    const userRequests = await this.prisma.ftUserRequest.findMany({
      where: { userId, ftTimeWindows },
      select: SELECT_FT_USER_REQUESTS_BY_USER_ID,
    });

    return userRequests.map(({ ftTimeWindows: { start, end, ft } }) => ({
      start,
      end,
      ft,
    }));
  }

  async getVolunteerAssignments(volunteerId: number): Promise<VolunteerTask[]> {
    const assignments = await this.prisma.assignment.findMany({
      where: { assigneeId: volunteerId },
      select: SELECT_VOLUNTEER_ASSIGNMENTS,
    });

    return assignments.map(({ timespan, timespanId }) => {
      const { start, end } = timespan;
      const { ft } = timespan.timeWindow;
      return { start, end, ft, timespanId };
    });
  }

  async getUserTeams(id: number): Promise<string[]> {
    const teams = await this.prisma.team.findMany({
      select: {
        code: true,
      },
      where: {
        users: {
          some: {
            user_id: id,
          },
        },
      },
    });
    return teams.map((t) => t.code);
  }

  async createUser(payload: UserCreationDto): Promise<UserWithoutPassword> {
    const newUserData: Prisma.UserUncheckedCreateInput = {
      firstname: payload.firstname,
      lastname: payload.lastname,
      email: payload.email,
      password: await new HashingUtilsService().hash(payload.password),
      nickname: payload.nickname,
      birthdate: payload.birthdate,
      phone: payload.phone,
      department: payload.department,
      comment: payload.comment,
      year: payload.year,
    };

    const newUser = await this.prisma.user.create({
      data: newUserData,
      select: SELECT_USER,
    });

    try {
      await this.mail.mailWelcome({
        email: newUser.email,
        firstname: newUser.firstname,
      });
    } catch (e) {
      this.logger.error(e);
    }

    if (!payload.teamId) return newUser;

    const addTeamData: Prisma.User_TeamUncheckedCreateInput = {
      team_id: payload.teamId,
      user_id: newUser.id,
    };

    await this.prisma.user_Team.create({
      data: addTeamData,
    });
    return newUser;
  }

  async updateUser(
    targetUserId: number,
    userData: UserModificationDto,
    author: JwtUtil,
  ): Promise<UserWithTeamAndPermission> {
    if (!this.canUpdateUser(author, targetUserId)) {
      throw new ForbiddenException('Tu ne peux pas modifier ce bénévole');
    }

    if (!this.canUpdateCharisma(author)) {
      delete userData.charisma;
    }
    if (!this.canUpdateContributionPayment(author)) {
      delete userData.has_payed_contributions;
    }

    const user = await this.prisma.user.update({
      select: {
        ...SELECT_USER,
        ...SELECT_USER_TEAMS_AND_PERMISSIONS,
      },
      data: userData,
      where: { id: targetUserId },
    });
    return this.getUserWithTeamAndPermission(user);
  }

  async deleteUser(id: number): Promise<void> {
    const deleteUser = this.prisma.user.update({
      where: { id },
      data: { is_deleted: true },
      select: { id: true },
    });

    const removeFriendRequests = this.prisma.friend.deleteMany({
      where: { OR: [{ requestorId: id }, { friendId: id }] },
    });

    await this.prisma.$transaction([deleteUser, removeFriendRequests]);
  }

  async getVolunteerAssignmentStats(
    volunteerId: number,
  ): Promise<VolunteerAssignmentStat[]> {
    const assignments = await this.prisma.assignment.findMany({
      where: { assigneeId: volunteerId },
      select: SELECT_TIMESPAN_PERIOD_WITH_CATEGORY,
    });
    return this.formatAssignmentStats(assignments);
  }

  private formatAssignmentStats(
    assignments: DatabaseVolunteerAssignmentStat[],
  ) {
    const stats = assignments.reduce((stats, { timespan }) => {
      const category = timespan.timeWindow.ft.category;
      const durationToAdd = getPeriodDuration(timespan);
      const previousDuration = stats.get(category)?.duration ?? 0;
      const duration = previousDuration + durationToAdd;
      stats.set(category, { category, duration });
      return stats;
    }, new Map<TaskCategory, VolunteerAssignmentStat>());
    return [...stats.values()];
  }

  getUsername(user: UserWithoutPassword): Username {
    return {
      id: user.id,
      username: user.firstname + ' ' + user.lastname,
    };
  }

  private getUserWithTeamAndPermission(
    user: UserWithoutPassword & {
      team: TeamWithNestedPermissions[];
    },
  ): UserWithTeamAndPermission {
    const teams = user.team.map((t) => t.team.code);
    const permissions = retrievePermissions(user.team);
    return user
      ? {
          ...user,
          team: teams,
          permissions: [...permissions],
        }
      : undefined;
  }

  private getMyUserInformation(
    user: DatabaseMyUserInformation,
  ): MyUserInformation {
    const { _count, ...userWithoutCount } = user;
    const userWithTeamAndPermission =
      this.getUserWithTeamAndPermission(userWithoutCount);
    return {
      ...userWithTeamAndPermission,
      tasksCount: _count.assignments,
    };
  }

  private canUpdateCharisma(author: JwtUtil): boolean {
    return author.isAdmin() || author.hasPermission('manage-users');
  }

  private canUpdateContributionPayment(author: JwtUtil): boolean {
    return author.isAdmin() || author.hasPermission('manage-cp');
  }

  private canUpdateUser(author: JwtUtil, targetUserId: number): boolean {
    return (
      author.isAdmin() ||
      author.hasPermission('manage-users') ||
      author.id === targetUserId
    );
  }
}
