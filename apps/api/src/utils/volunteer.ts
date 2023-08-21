import { UserName } from "../ft/ft-types";

export function buildVolunteerDisplayName(volunteer: UserName) {
  return `${volunteer.firstname} ${volunteer.lastname}`;
}
