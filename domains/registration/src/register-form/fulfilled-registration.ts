export const BDE_CODE = "bde";
export const STRASBOURG_CODE = "strasbourg";
export const KFET_CODE = "kfet";
export const KARNA_CODE = "karna";
export const TECKOS_CODE = "teckos";
export const TENDRESTIVAL_CODE = "tendrestival";
export const CVL_CODE = "cvl";

export type TeamCode =
  | typeof BDE_CODE
  | typeof STRASBOURG_CODE
  | typeof KFET_CODE
  | typeof KARNA_CODE
  | typeof TECKOS_CODE
  | typeof CVL_CODE
  | typeof TENDRESTIVAL_CODE;

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
};
