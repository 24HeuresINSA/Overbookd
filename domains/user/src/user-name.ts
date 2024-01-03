import type { UserName } from "./user.model";

export function nicknameOrName(user: UserName): string {
  const { nickname, firstname, lastname } = user;
  return nickname ?? `${firstname} ${lastname}`;
}
