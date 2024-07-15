import type { UserName } from "./user.js";

export function nicknameOrName(user: UserName): string {
  const { nickname, firstname, lastname } = user;
  return nickname ?? `${firstname} ${lastname}`;
}
