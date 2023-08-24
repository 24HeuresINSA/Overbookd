export const BDE_CODE = "bde";
export const STRASBOURG_CODE = "strasbourg";
export const KFET_CODE = "kfet";
export const KARNA_CODE = "karna";
export const WOODSTOWER_CODE = "woods";
export const TECKOS_CODE = "teckos";
export const TENDRESTIVAL_CODE = "tendrestival";

export type TeamCode =
  | typeof BDE_CODE
  | typeof STRASBOURG_CODE
  | typeof KFET_CODE
  | typeof KARNA_CODE
  | typeof WOODSTOWER_CODE
  | typeof TECKOS_CODE
  | typeof TENDRESTIVAL_CODE;

export type IDefineARegistree = {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  mobilePhone: string;
  nickname?: string;
  birthdate: Date;
  comment?: string;
  teams: TeamCode[];
};
