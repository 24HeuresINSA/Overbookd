export const COUNT_FRIENDS = {
  _count: { select: { friends: true, friendRequestors: true } },
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
