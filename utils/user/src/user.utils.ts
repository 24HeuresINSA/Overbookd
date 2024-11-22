import type { User, UserName } from "./user.js";

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
  const nickname = user.nickname ? ` (${user.nickname}) ` : " ";
  return `${user.firstname}${nickname}${user.lastname}`;
}

export function toStandAloneUser(user: User) {
  const name = buildUserNameWithNickname(user);
  return { id: user.id, name };
}
