import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, User } from '@prisma/client';
import { Username } from './dto/userName.dto';
import { HashingUtilsService } from '../hashing-utils/hashing-utils.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
      include: {
        team: true,
      },
    });
    const res: User & { team: string[] } = {
      ...user,
      team: user.team.map((team) => team.team_id),
    };
    return res;
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
      include: {
        team: true,
      },
    });
    //transform the result to match the dto
    const res: (User & { team: string[] })[] = users.map((user) => {
      return {
        ...user,
        team: user.team.map((team) => team.team_id),
      };
    });
    return res;
  }

  async createUser(payload: Prisma.UserCreateInput): Promise<User> {
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

    return this.prisma.user.create({ data: data });
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
  ): Promise<User> {
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
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
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
