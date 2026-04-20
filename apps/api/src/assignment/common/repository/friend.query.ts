import { IS_NOT_DELETED } from "../../../common/query/not-deleted.query";

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
