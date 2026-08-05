import { AssignmentFriend } from "@overbookd/http";
import { PrismaService } from "../../../prisma.service";
import { AssignmentFriends } from "../volunteer-to-task.service";
import { SELECT_VOLUNTEER_ASSIGNMENT_FRIENDS } from "./volunteer.query";
import { User } from "@overbookd/user";

export class PrismaAssignmentFriends implements AssignmentFriends {
  constructor(private readonly prisma: PrismaService) {}

  async findFriendsFor(volunteerId: number): Promise<AssignmentFriend[]> {
    const { friends, friendRequestors } = await this.prisma.user.findUnique({
      where: { id: volunteerId },
      select: SELECT_VOLUNTEER_ASSIGNMENT_FRIENDS,
    });

    const directFriendIds = new Set<number>(
      friendRequestors.map(({ friend }) => friend.id),
    );

    const uniqueFriends = [
      ...new Map<number, User>([
        ...friends.map(({ requestor }) => [requestor.id, requestor] as const),
        ...friendRequestors.map(({ friend }) => [friend.id, friend] as const),
      ]).values(),
    ];

    return uniqueFriends.map((friend) => ({
      ...friend,
      isDirectFriend: directFriendIds.has(friend.id),
    }));
  }
}
