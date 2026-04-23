import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../src/prisma.service";
import { User, UserWithTeams } from "@overbookd/user";
import { SELECT_USER_WITH_TEAM_CODES } from "../common/query/user.query";
import { CAMION, FEN, VOITURE } from "@overbookd/team-constants";
import { IS_CURRENT_EDITION_CANDIDATE_OR_VOLUNTEER } from "../user/user.query";

type DatabaseFriend = User & { teams: { teamCode: string }[] };

@Injectable()
export class FriendService {
  constructor(private prisma: PrismaService) {}

  async findUserFriends(id: number): Promise<UserWithTeams[]> {
    const friends = await this.prisma.friend.findMany({
      where: {
        requestor: { id, ...IS_CURRENT_EDITION_CANDIDATE_OR_VOLUNTEER },
      },
      select: { friend: { select: SELECT_USER_WITH_TEAM_CODES } },
    });
    return friends.map(({ friend }) => FriendService.formatToFriend(friend));
  }

  async findFriends(): Promise<UserWithTeams[]> {
    const nonFriendableTeams = [FEN, VOITURE, CAMION];

    const friends = await this.prisma.user.findMany({
      select: SELECT_USER_WITH_TEAM_CODES,
      where: {
        teams: {
          none: { team: { code: { in: nonFriendableTeams } } },
        },
        ...IS_CURRENT_EDITION_CANDIDATE_OR_VOLUNTEER,
      },
    });
    return friends.map(FriendService.formatToFriend);
  }

  async create(requestorId: number, friendId: number): Promise<UserWithTeams> {
    const isAlreadyFriend = await this.prisma.friend.findFirst({
      where: { requestorId, friendId },
    });
    if (isAlreadyFriend) {
      throw new ForbiddenException(
        "Cette personne fait déjà partie des ami·e·s",
      );
    }

    const { friend } = await this.prisma.friend.create({
      data: { requestorId, friendId },
      select: { friend: { select: SELECT_USER_WITH_TEAM_CODES } },
    });
    return FriendService.formatToFriend(friend);
  }

  async delete(requestorId: number, friendId: number): Promise<void> {
    await this.prisma.friend.delete({
      where: { requestorId_friendId: { requestorId, friendId } },
    });
  }

  static formatToFriend({
    teams: teamCodes,
    ...friend
  }: DatabaseFriend): UserWithTeams {
    const teams = teamCodes.map(({ teamCode }) => teamCode);
    return { teams, ...friend };
  }
}
