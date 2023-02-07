import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, User } from '@prisma/client';
import { Username } from './dto/userName.dto';
import { HashingUtilsService } from '../hashing-utils/hashing-utils.service';
import {
  retrievePermissions,
  TeamWithNestedPermissions,
} from '../team/utils/permissions';
import { join } from 'path';

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

export type UserWithoutPassword = Omit<User, 'password'>;
type UserWithTeamAndPermission = UserWithoutPassword & {
  team: string[];
  permissions: string[];
};
export type UserPasswordOnly = Pick<User, 'password'>;

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

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

  async createUser(
    payload: Prisma.UserCreateInput,
  ): Promise<UserWithoutPassword> {
    // take only the right fields
    const data: Prisma.UserUncheckedCreateInput = {
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

    return this.prisma.user.create({ data: data, select: SELECT_USER });
  }

  async addAvailabilitiesToUser(
    user_id: number,
    availabilities: number[],
  ): Promise<null> {
    return null;
  }

  async updateUser(
    params: {
      where: Prisma.UserWhereUniqueInput;
      data: Prisma.UserUpdateInput;
    },
    currentUser: any,
  ): Promise<UserWithoutPassword> {
    if (!currentUser.role.includes('admin')) {
      // Remove balance from data
      delete params.data.balance;
    }
    if (!currentUser.role.filter((n: any) => ['human', 'admin'].includes(n))) {
      // Remove teams from charisma
      delete params.data.charisma;
    }
    const team = params.data.team;
    if (team) {
      // Remove teams from data
      delete params.data.team;
    }
    const { where, data } = params;
    return this.prisma.user.update({
      select: SELECT_USER,
      data,
      where,
    });
  }

  async deleteUser(
    where: Prisma.UserWhereUniqueInput,
  ): Promise<UserWithoutPassword> {
    return this.prisma.user.delete({
      select: SELECT_USER,
      where,
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

  async uploadPP(
    where: Prisma.UserWhereUniqueInput,
    pp: string,
  ): Promise<UserWithoutPassword> {
    if (this.getPP(where) !== null) {
      await this.deletePP(where);
    }
    return this.prisma.user.update({
      where,
      data: { pp },
    });
  }

  async getPP(where: Prisma.UserWhereUniqueInput): Promise<string> {
    const file = await this.prisma.user.findUnique({
      where,
      select: { pp: true },
    });
    return file.pp;
  }

  async deletePP(where: Prisma.UserWhereUniqueInput): Promise<void> {
    const file = await this.prisma.user.findUnique({
      where,
      select: { pp: true },
    });
    if (file.pp) {
      const filepath = join(process.cwd(), '/public', file.pp);
      if (fs.existsSync(filepath)) {
        await fs.unlink(filepath, (err) => {
          if (err) {
            throw err;
          }
        });
      }
    }
  }
}
