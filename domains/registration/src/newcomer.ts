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

export const ADHERENT = "ADHERENT";
export const VOLUNTEER = "VOLUNTEER";

export type Membership = typeof ADHERENT | typeof VOLUNTEER;
type WithMembership<T extends Membership> = { membership: T };

export type NewcomerRegistered<T extends Membership> = Registree &
  WithMembership<T>;

export type AdherentRegistered = NewcomerRegistered<typeof ADHERENT>;
export type VolunteerRegistered = NewcomerRegistered<typeof VOLUNTEER>;
export type MemberRegistered = NewcomerRegistered<Membership>;

export function isAdherentRegistered(
  registree: NewcomerRegistered<Membership>,
): registree is AdherentRegistered {
  return registree.membership === ADHERENT;
}

export function isVolunteerRegistered(
  registree: NewcomerRegistered<Membership>,
): registree is VolunteerRegistered {
  return registree.membership === VOLUNTEER;
}
