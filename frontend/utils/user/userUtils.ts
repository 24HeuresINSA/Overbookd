import { Friend, User } from "../models/user";

export function formatUsername({ firstname, lastname }: User): string {
  return `${firstname} ${lastname}`;
}

export function formatNameWithNickname({
  lastname,
  firstname,
  nickname,
}: Friend): string {
  const displayedNickname = nickname ? `(${nickname})` : "";
  return `${firstname} ${lastname} ${displayedNickname}`;
}
