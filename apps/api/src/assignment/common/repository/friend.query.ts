import { FriendCount } from "@overbookd/http";
import { IS_NOT_DELETED } from "../../../common/query/not-deleted.query";
import { SELECT_TEAMS_CODE } from "../../../common/query/user.query";
import { HAS_CURRENT_MEMBERSHIP_APPLICATION } from "../../../user/user.query";
import { PERSONNE } from "@overbookd/team-constants";

export const COUNT_FRIENDS = {
  _count: {
    select: {
      friends: { where: { friend: IS_NOT_DELETED } },
      friendRequestors: { where: { requestor: IS_NOT_DELETED } },
    },
  },
};

export type DatabaseFriendCount = {
  _count: {
    friends: number;
    friendRequestors: number;
  };
};

export function hasAtLeastOneFriend({
  _count: { friends, friendRequestors },
}: DatabaseFriendCount): boolean {
  return friends > 0 || friendRequestors > 0;
}

export const SELECT_USER_FRIENDS = {
  friends: {
    select: {
      requestor: {
        select: { id: true, ...SELECT_TEAMS_CODE },
      },
    },
    where: {
      requestor: {
        ...IS_NOT_DELETED,
        ...HAS_CURRENT_MEMBERSHIP_APPLICATION,
      },
    },
  },
  friendRequestors: {
    select: {
      friend: { select: { id: true, ...SELECT_TEAMS_CODE } },
    },
    where: {
      friend: {
        ...IS_NOT_DELETED,
        ...HAS_CURRENT_MEMBERSHIP_APPLICATION,
      },
    },
  },
};

export type DatabaseFriends = {
  friends: { requestor: { id: number; teams: { teamCode: string }[] } }[];
  friendRequestors: { friend: { id: number; teams: { teamCode: string }[] } }[];
};

function isEnrolledVolunteer({
  teams,
}: {
  teams: { teamCode: string }[];
}): boolean {
  return teams.some(({ teamCode }) => teamCode === PERSONNE);
}

export function getFriendCount({
  friends,
  friendRequestors,
}: DatabaseFriends): FriendCount {
  const uniqueFriends = new Map<number, boolean>([
    ...friends.map(
      ({ requestor }) =>
        [requestor.id, isEnrolledVolunteer(requestor)] as const,
    ),
    ...friendRequestors.map(
      ({ friend }) => [friend.id, isEnrolledVolunteer(friend)] as const,
    ),
  ]);

  const friendCount = [...uniqueFriends.values()].reduce<FriendCount>(
    (
      { volunteerCount: volunteers, candidateCount: candidates },
      isVolunteer,
    ) =>
      isVolunteer
        ? { volunteerCount: volunteers + 1, candidateCount: candidates }
        : { volunteerCount: volunteers, candidateCount: candidates + 1 },
    { volunteerCount: 0, candidateCount: 0 },
  );

  return friendCount;
}
