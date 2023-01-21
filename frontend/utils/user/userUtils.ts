import { User } from "../models/user";

export function formatUsername({ firstname, lastname }: User): string {
  return `${firstname} ${lastname}`;
}
