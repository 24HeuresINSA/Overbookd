import type { User, UserName } from "./user.js";

export function buildUserName(user: UserName): string {
  return `${user.firstName} ${user.lastName}`;
}

export function nicknameOrName(user: UserName): string {
  const { nickname, ...name } = user;
  return nickname || buildUserName(name);
}

export function nicknameOrFirstName({ nickname, firstName }: UserName): string {
  return nickname || firstName;
}

export function buildUserNameWithNickname(user: UserName): string {
  const nickname = user.nickname ? ` (${user.nickname}) ` : " ";
  return `${user.firstName}${nickname}${user.lastName}`;
}

export function toStandAloneUser(user: User) {
  const name = buildUserNameWithNickname(user);
  return { id: user.id, name };
}
