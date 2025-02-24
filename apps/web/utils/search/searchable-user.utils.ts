import type { UserName } from "@overbookd/user";
import type { Searchable } from "./search.utils";
import { SlugifyService } from "@overbookd/slugify";

export function toSearchable<T extends UserName>(user: T): Searchable<T> {
  const { nickname, firstname, lastname, email, mobilePhone } = user;
  const userIdentity = `${firstname} ${lastname} ${nickname} ${email} ${mobilePhone}`;
  const searchable = SlugifyService.apply(userIdentity);
  return { ...user, searchable };
}
