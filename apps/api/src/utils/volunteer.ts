import { UserName } from "@overbookd/user";

export function buildVolunteerDisplayName(volunteer: UserName) {
  return `${volunteer.firstname} ${volunteer.lastname}`;
}
