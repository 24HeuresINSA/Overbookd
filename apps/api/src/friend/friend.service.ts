import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../src/prisma.service";
import { User } from "@overbookd/user";
import { SELECT_USER_IDENTIFIER } from "../common/query/user.query";
import { IS_NOT_DELETED } from "../common/query/not-deleted.query";

@Injectable()
export class FriendService {
  constructor(private prisma: PrismaService) {}

  async findUserFriends(id: number): Promise<User[]> {
    const friends = await this.prisma.friend.findMany({
      where: { requestorId: id },
      select: { friend: { select: SELECT_USER_IDENTIFIER } },
    });
    return friends.map(({ friend }) => friend);
  }

  async findFriends(): Promise<User[]> {
    const nonFriendableTeams = ["fen", "voiture", "camion"];

    return this.prisma.user.findMany({
      select: SELECT_USER_IDENTIFIER,
      where: {
        teams: {
          none: { team: { code: { in: nonFriendableTeams } } },
        },
        ...IS_NOT_DELETED,
      },
    });
  }

  async create(requestorId: number, friendId: number): Promise<User> {
    const isAlreadyFriend = await this.prisma.friend.findFirst({
      where: { requestorId, friendId },
    });
    if (isAlreadyFriend) {
      throw new ForbiddenException("Cette personne fait déjà partie des amis");
    }

    const { friend } = await this.prisma.friend.create({
      data: { requestorId, friendId },
      select: { friend: { select: SELECT_USER_IDENTIFIER } },
    });
    return friend;
  }

  async delete(requestorId: number, friendId: number): Promise<void> {
    await this.prisma.friend.delete({
      where: { requestorId_friendId: { requestorId, friendId } },
    });
  }
}
