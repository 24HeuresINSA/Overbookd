import type { UserName } from "./user.js";

export function buildUserName(user: UserName): string {
  return `${user.firstname} ${user.lastname}`;
}

export function nicknameOrName(user: UserName): string {
  const { nickname, ...name } = user;
  return nickname || buildUserName(name);
}

export function nicknameOrFirstName({ nickname, firstname }: UserName): string {
  return nickname || firstname;
}

export function buildUserNameWithNickname(user: UserName): string {
  const { nickname, ...name } = user;
  const displayedNickname = nickname ? ` (${nickname})` : "";
  return `${buildUserName(name)}${displayedNickname}`;
}
