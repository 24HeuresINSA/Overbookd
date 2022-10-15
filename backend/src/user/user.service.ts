import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, User } from '@prisma/client';
import { Username } from './dto/userName.dto';
import { HashingUtilsService } from '../hashing-utils/hashing-utils.service';
import { UserReadDto } from './dto/userRead.dto';

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
      team_id: true,
    },
  },
};

export type UserWithoutPassword = Omit<User, 'password'>;

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async user_safe(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<UserReadDto> {
    const user = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
      select: {
        ...SELECT_USER,
        ...SELECT_USER_TEAM,
        password: true,
      },
    });
    return {
      ...user,
      team: user?.team.map((t) => t.team_id),
    };
  }

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<UserReadDto | null> {
    const user = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
      select: {
        ...SELECT_USER,
        ...SELECT_USER_TEAM,
      },
    });
    if (!user) {
      return null;
    }
    return {
      ...user,
      team: user?.team.map((t) => t.team_id),
    };
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
    select?: Prisma.UserSelect;
  }): Promise<Partial<User>[]> {
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
    return users.map((user) => {
      return {
        ...user,
        team: user?.team.map((t) => t.team_id),
      };
    });
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
      nickname: payload.nickname || '',
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

  getUsername(user: User): Username {
    return {
      id: user.id,
      username: user.firstname + ' ' + user.lastname,
    };
  }
}
