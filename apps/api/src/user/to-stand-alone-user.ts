import { User } from "@overbookd/user";

export function toStandAloneUser(user: User) {
  const nickname = user.nickname ? ` (${user.nickname}) ` : " ";
  const name = `${user.firstname}${nickname}${user.lastname}`;
  return { id: user.id, name };
}
