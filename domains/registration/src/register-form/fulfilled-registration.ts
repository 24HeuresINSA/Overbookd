import {
  BDE,
  CVL,
  KARNA,
  KFET,
  ROUEN,
  STRASBOURG,
  TECKOS,
  HAUTS_DE_FRANCE,
} from "@overbookd/team-constants";

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

export type FulfilledRegistration = {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  mobilePhone: string;
  nickname?: string;
  birthdate: Date;
  comment?: string;
  teams: Teams;
  hasApprovedEULA: boolean;
  hasSignedVolunteerCharter: boolean;
};
