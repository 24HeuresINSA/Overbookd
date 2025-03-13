import type { UserName } from "@overbookd/user";
import type { Searchable } from "./search.utils";
import { SlugifyService } from "@overbookd/slugify";

type SearchedUser = UserName & {
  mobilePhone?: string;
  email?: string;
};

export function toSearchable<T extends SearchedUser>(user: T): Searchable<T> {
  const { nickname, firstname, lastname, email, mobilePhone } = user;
  const userIdentity = `${firstname} ${lastname} ${nickname} ${email} ${mobilePhone}`;
  const searchable = SlugifyService.apply(userIdentity);
  return { ...user, searchable };
}
