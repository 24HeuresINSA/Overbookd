import {
  BDE,
  CVL,
  KARNA,
  KFET,
  ROUEN,
  STRASBOURG,
  TECKOS,
  HAUTS_DE_FRANCE,
} from "@overbookd/team-code";

export const TEAM_CODES: TeamCode[] = [
  BDE,
  STRASBOURG,
  KFET,
  KARNA,
  TECKOS,
  HAUTS_DE_FRANCE,
  CVL,
  ROUEN,
];

export type TeamCode =
  | typeof BDE
  | typeof STRASBOURG
  | typeof KFET
  | typeof KARNA
  | typeof TECKOS
  | typeof CVL
  | typeof HAUTS_DE_FRANCE
  | typeof ROUEN;

export type Teams = [] | [TeamCode] | [TeamCode, TeamCode];

export function isTeamCode(code: string): code is TeamCode {
  return TEAM_CODES.includes(code as TeamCode);
}

export type BaseFulfilledRegistration = {
  email: string;
  firstName: string;
  lastName: string;
  mobilePhone: string;
  nickname?: string;
  birthDate: Date;
  comment?: string;
  teams: Teams;
  hasApprovedEULA: boolean;
  hasSignedVolunteerCharter?: boolean;
};

export const accountStatuses = {
  EXISTING: "EXISTING",
  NEW: "NEW",
};

export type AccountStatus =
  (typeof accountStatuses)[keyof typeof accountStatuses];

export type ExistingAccountFulfilledRegistration = BaseFulfilledRegistration & {
  status: typeof accountStatuses.EXISTING;
};

export type NewAccountFulfilledRegistration = BaseFulfilledRegistration & {
  status: typeof accountStatuses.NEW;
  password: string;
};

export type FulfilledRegistration =
  ExistingAccountFulfilledRegistration | NewAccountFulfilledRegistration;

export function isNewAccountRegistration(
  registration: Partial<FulfilledRegistration>,
): registration is Partial<NewAccountFulfilledRegistration> {
  return registration.status === accountStatuses.NEW;
}
