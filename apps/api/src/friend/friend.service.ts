import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../src/prisma.service";
import { Friend, User, UserWithTeams } from "@overbookd/user";
import { SELECT_USER_WITH_TEAM_CODES } from "../common/query/user.query";
import { CAMION, FEN, VOITURE } from "@overbookd/team-code";
import { IS_CURRENT_EDITION_CANDIDATE_OR_VOLUNTEER } from "../user/user.query";

type DatabaseFriend = User & {
  teams: { teamCode: string }[];
  profilePicture?: string | null;
};

const SELECT_FRIEND = { ...SELECT_USER_WITH_TEAM_CODES, profilePicture: true };

@Injectable()
export class FriendService {
  constructor(private prisma: PrismaService) {}

  async findFriendsFor(id: number): Promise<UserWithTeams[]> {
    const nonFriendableTeams = [FEN, VOITURE, CAMION];

    const friends = await this.prisma.user.findMany({
      select: SELECT_USER_WITH_TEAM_CODES,
      where: {
        teams: {
          none: { team: { code: { in: nonFriendableTeams } } },
        },
        friends: { none: { requestorId: id } },
        ...IS_CURRENT_EDITION_CANDIDATE_OR_VOLUNTEER,
      },
    });
    return friends.map(FriendService.formatToFriend);
  }

  async findUserFriends(id: number): Promise<Friend[]> {
    const friends = await this.prisma.friend.findMany({
      where: {
        requestor: { id, ...IS_CURRENT_EDITION_CANDIDATE_OR_VOLUNTEER },
      },
      select: { friend: { select: SELECT_FRIEND } },
    });
    return friends.map(({ friend }) => FriendService.formatToFriend(friend));
  }

  async create(requestorId: number, friendId: number): Promise<Friend> {
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
      select: { friend: { select: SELECT_FRIEND } },
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
  }: DatabaseFriend): Friend {
    const teams = teamCodes.map(({ teamCode }) => teamCode);
    return { teams, ...friend };
  }
}
