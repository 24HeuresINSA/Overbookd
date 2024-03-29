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
}

function retrieveFriend({ friend }: FriendWithData): User {
  return {
    id: friend.id,
    firstname: friend.firstname,
    lastname: friend.lastname,
    nickname: friend.nickname,
  };
}
