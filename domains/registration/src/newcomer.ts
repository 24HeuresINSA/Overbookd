import { TEAM_CODES, Teams } from "./register-form";

export function isJoinableTeams(teams: string[]): teams is Teams {
  const maxTwoTeams = teams.length <= 2;
  const onlyJoinableTeams = teams.every((team) =>
    TEAM_CODES.some((code) => code === team),
  );
  return maxTwoTeams && onlyJoinableTeams;
}

export type Registree = {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  mobilePhone: string;
  nickname?: string;
  birthdate: Date;
  comment?: string;
  teams: Teams;
};

export const STAFF = "STAFF";
export const VOLUNTEER = "VOLUNTEER";

export type Membership = typeof STAFF | typeof VOLUNTEER;
type WithMembership<T extends Membership> = { membership: T };

export type NewcomerRegistered<T extends Membership> = Registree &
  WithMembership<T>;

export type StaffRegistered = NewcomerRegistered<typeof STAFF>;
export type VolunteerRegistered = NewcomerRegistered<typeof VOLUNTEER>;
export type MemberRegistered = NewcomerRegistered<Membership>;

export function isStaffRegistered(
  registree: NewcomerRegistered<Membership>,
): registree is StaffRegistered {
  return registree.membership === STAFF;
}

export function isVolunteerRegistered(
  registree: NewcomerRegistered<Membership>,
): registree is VolunteerRegistered {
  return registree.membership === VOLUNTEER;
}
