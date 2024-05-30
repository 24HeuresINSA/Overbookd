import { UserName } from "@overbookd/user";
import { Searchable } from "./search.utils";
import { SlugifyService } from "@overbookd/slugify";

export function toSearchable<T extends UserName>(user: T): Searchable<T> {
  const { nickname, firstname, lastname } = user;
  const nicknameOrEmpty = nickname ? ` ${nickname}` : "";
  const userIdentity = `${firstname} ${lastname}${nicknameOrEmpty}`;
  const searchable = SlugifyService.apply(userIdentity);
  return { ...user, searchable };
}
