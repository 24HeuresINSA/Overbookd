import { FriendCount } from "@overbookd/assignment";
import { SELECT_TEAM_CODES } from "../../../common/query/user.query";
import { IS_CURRENT_EDITION_CANDIDATE_OR_VOLUNTEER } from "../../../user/user.query";
import { PERSONNE } from "@overbookd/team-constants";

export const SELECT_USER_FRIENDS_FOR_COUNT = {
  friends: {
    select: {
      requestor: {
        select: { id: true, ...SELECT_TEAM_CODES },
      },
    },
    where: {
      requestor: IS_CURRENT_EDITION_CANDIDATE_OR_VOLUNTEER,
    },
  },
  friendRequestors: {
    select: {
      friend: { select: { id: true, ...SELECT_TEAM_CODES } },
    },
    where: {
      friend: IS_CURRENT_EDITION_CANDIDATE_OR_VOLUNTEER,
    },
  },
};

export type DatabaseFriendForCount = {
  id: number;
  teams: { teamCode: string }[];
};

export type DatabaseFriendCount = {
  friends: { requestor: DatabaseFriendForCount }[];
  friendRequestors: { friend: DatabaseFriendForCount }[];
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
}: DatabaseFriendCount): FriendCount {
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
