import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../src/prisma.service";
import { User } from "@overbookd/user";

type FriendWithData = {
  friend: User;
};

@Injectable()
export class FriendService {
  constructor(private prisma: PrismaService) {}

  private readonly SELECT_FRIEND = {
    id: true,
    lastname: true,
    firstname: true,
    nickname: true,
  };

  async findUserFriends(id: number): Promise<User[]> {
    const friends = await this.prisma.friend.findMany({
      where: {
        requestorId: id,
      },
      select: {
        friend: {
          select: this.SELECT_FRIEND,
        },
      },
    });

    return friends.map(retrieveFriend);
  }

  async findFriends(): Promise<User[]> {
    const nonFriendableTeams = ["fen", "voiture", "camion"];

    return this.prisma.user.findMany({
      select: this.SELECT_FRIEND,
      where: {
        teams: {
          none: {
            team: {
              code: { in: nonFriendableTeams },
            },
          },
        },
        isDeleted: false,
      },
    });
  }

  async create(requestorId: number, friendId: number): Promise<User | null> {
    const { friend } = await this.prisma.friend.create({
      data: {
        requestorId,
        friendId,
      },
      select: {
        friend: {
          select: this.SELECT_FRIEND,
        },
      },
    });

    return friend;
  }

  async delete(requestorId: number, friendId: number): Promise<void> {
    await this.prisma.friend.delete({
      where: {
        requestorId_friendId: {
          requestorId,
          friendId,
        },
      },
    });
  }

  async createBiDirectional(id1: number, id2: number): Promise<number | null> {
    const { count } = await this.prisma.friend.createMany({
      data: [
        {
          requestorId: id1,
          friendId: id2,
        },
        {
          requestorId: id2,
          friendId: id1,
        },
      ],
      skipDuplicates: true,
    });

    return count;
  }

  async deleteBiDirectionnal(id1: number, id2: number): Promise<void> {
    await this.prisma.friend.deleteMany({
      where: {
        requestorId: { in: [id1, id2] },
        friendId: { in: [id1, id2] },
      },
    });
  }
}

function retrieveFriend({ friend }: FriendWithData): User {
  return {
    id: friend.id,
    firstname: friend.firstname,
    lastname: friend.lastname,
    nickname: friend.nickname,
  };
}
