import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { Ft, Prisma, User } from '@prisma/client';
import { JwtUtil } from 'src/auth/entities/JwtUtil.entity';
import { Period } from 'src/volunteer-availability/domain/period.model';
import { HashingUtilsService } from '../hashing-utils/hashing-utils.service';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma.service';
import {
  retrievePermissions,
  TeamWithNestedPermissions,
} from '../team/utils/permissions';
import { UserCreationDto } from './dto/userCreation.dto';
import { UserModificationDto } from './dto/userModification.dto';
import { Username } from './dto/userName.dto';

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

const SELECT_USER_TEAM = {
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

export type UserWithoutPassword = Omit<User, 'password'>;
export type UserWithTeamAndPermission = UserWithoutPassword & {
  team: string[];
  permissions: string[];
};
export type UserPasswordOnly = Pick<User, 'password'>;

export type RequiredOnTask = Period & Pick<Ft, 'id' & 'name' & 'status'>;

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private mail: MailService) {}
  private logger = new Logger('UserService');

  async user(
    findCondition: Prisma.UserWhereUniqueInput & Prisma.UserWhereInput,
  ): Promise<UserWithTeamAndPermission | null> {
    const user = await this.prisma.user.findUnique({
      where: findCondition,
      select: {
        ...SELECT_USER,
        ...SELECT_USER_TEAM,
      },
    });
    return this.getUserWithTeamAndPermission(user);
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
        ...SELECT_USER_TEAM,
      },
    });
    return this.getUserWithTeamAndPermission(updatedUser);
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
    select?: Prisma.UserSelect;
  }): Promise<UserWithTeamAndPermission[]> {
    const { skip, take, cursor, where, orderBy } = params;
    //get all users with their teams
    const users = await this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select: {
        ...SELECT_USER,
        ...SELECT_USER_TEAM,
      },
    });
    return users.map((user) => this.getUserWithTeamAndPermission(user));
  }

  async getFtUserRequestsByUserId(userId: number): Promise<RequiredOnTask[]> {
    const userRequests = await this.prisma.ftUserRequest.findMany({
      where: { userId, ftTimeWindows: { ft: { isDeleted: false } } },
      select: SELECT_FT_USER_REQUESTS_BY_USER_ID,
    });
    return userRequests.map(({ ftTimeWindows: { start, end, ft } }) => ({
      start,
      end,
      ft,
    }));
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
        ...SELECT_USER_TEAM,
      },
      data: userData,
      where: { id: targetUserId },
    });
    return this.getUserWithTeamAndPermission(user);
  }

  async deleteUser(id: number): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { is_deleted: true },
      select: { id: true },
    });
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
