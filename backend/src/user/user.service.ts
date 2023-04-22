import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { Ft, Prisma, TaskCategory } from '@prisma/client';
import { JwtUtil } from 'src/auth/entities/JwtUtil.entity';
import { Period } from 'src/volunteer-availability/domain/period.model';
import { ftStatuses } from '../ft/ft.model';
import { HashingUtilsService } from '../hashing-utils/hashing-utils.service';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma.service';
import {
  TeamWithNestedPermissions,
  retrievePermissions,
} from '../team/utils/permissions';
import {
  formatAssignmentAsTask,
  formatRequirementAsTask,
} from '../utils/assignment';
import { getPeriodDuration } from '../utils/duration';
import { UserCreationDto } from './dto/userCreation.dto';
import { UserModificationDto } from './dto/userModification.dto';
import { Username } from './dto/userName.dto';
import { VolunteerAssignmentStat } from './dto/volunteerAssignment.dto';
import { FileService } from './file.service';
import { DatabaseVolunteerAssignmentStat } from './types/volunteerAssignmentTypes';
import {
  UserPasswordOnly,
  UserWithTeamAndPermission,
  UserWithoutPassword,
} from './user.model';

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
  resetPasswordToken: true,
  resetPasswordExpires: true,
  hasPayedContributions: true,
  year: true,
  profilePicture: true,
  charisma: true,
  balance: true,
  createdAt: true,
  updatedAt: true,
  isDeleted: true,
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
              permissionName: true,
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

export const SELECT_FT_USER_REQUESTS_BY_USER_ID = {
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

export const SELECT_VOLUNTEER_ASSIGNMENTS = {
  timeSpan: {
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
  timeSpanId: true,
};

export const ACTIVE_NOT_ASSIGNED_FT_CONDITION = {
  ft: { isDeleted: false, NOT: { status: ftStatuses.READY } },
};

export const SELECT_TIMESPAN_PERIOD_WITH_CATEGORY = {
  timeSpan: {
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

export type MyUserInformation = UserWithTeamAndPermission & {
  tasksCount: number;
};

type DatabaseMyUserInformation = UserWithoutPassword & {
  team: TeamWithNestedPermissions[];
  _count: { assignments: number };
};

export type VolunteerTask = Period & {
  ft: Pick<Ft, 'id' | 'name' | 'status'>;
  timeSpanId?: number;
};
@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private mail: MailService,
    private fileService: FileService,
  ) {}
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

  async getUserTeams(id: number): Promise<string[]> {
    const teams = await this.prisma.team.findMany({
      select: {
        code: true,
      },
      where: {
        users: {
          some: {
            userId: id,
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

    const addTeamData: Prisma.UserTeamUncheckedCreateInput = {
      teamId: payload.teamId,
      userId: newUser.id,
    };

    await this.prisma.userTeam.create({
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
      delete userData.hasPayedContributions;
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
      data: { isDeleted: true },
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

  private async getProfilePicture(userId: number): Promise<string | null> {
    const { profilePicture } = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        profilePicture: true,
      },
    });
    return profilePicture;
  }

  async updateProfilePicture(
    userId: number,
    profilePicture: string,
  ): Promise<UserWithTeamAndPermission> {
    const currentProfilePicture = await this.getProfilePicture(userId);
    if (currentProfilePicture) {
      this.fileService.deleteFile(currentProfilePicture);
    }
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { profilePicture },
      select: {
        ...SELECT_USER,
        ...SELECT_USER_TEAMS_AND_PERMISSIONS,
      },
    });
    return this.getUserWithTeamAndPermission(user);
  }

  async streamProfilePicture(userId: number): Promise<StreamableFile> {
    const profilePictureName = await this.getProfilePicture(userId);
    if (!profilePictureName) {
      throw new NotFoundException('Profile picture not found');
    }
    return this.fileService.streamFile(profilePictureName);
  }
}
