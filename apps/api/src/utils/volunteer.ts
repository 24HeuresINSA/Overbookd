import { UserName } from 'src/ft/ftTypes';

export function buildVolunteerDisplayName(volunteer: UserName) {
  return `${volunteer.firstname} ${volunteer.lastname}`;
}
