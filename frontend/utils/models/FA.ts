import {FT} from "~/utils/models/FT";

export interface FA {
  _id?: string;
  count?: number;
  status: string;
  general?: {
    locations?: string[];
    name?: string;
    team?: string;
    isValid?: boolean;
    isRequiringPass?: boolean;
  };
  details: {};
  security: {};
  equipments: { _id: string; name: string; required: number }[];
  timeframes: { start: Date; end: Date; name: string }[];
  validated: String[];
  refused: String[];
  comments: { time: Date; text: string; validator: string; topic?: string }[];
  FTs: FT[];
  isValid: boolean;
  securityPasses: SecurityPass[];
  signalisation: Signalisation[];
  electricityNeeds: ElectricityNeed[];
}

export interface ElectricityNeed {
  connectionType: string;
  power: number;
}

export interface Signalisation {
  name: string;
  type: string;
  number: number;
  text: string;
}

export interface SecurityPass {
  fullname: string;
  phone: string;
  email: string;
  comment: string;
  licensePlate: string;
  timeslots: string[];
}

export enum EquipmentTypes {
  BARS = "BARS",
  BUREAUTIQUE = "BUREAUTIQUE",
  BOIS = "BOIS",
  CANAP = "CANAPE/FAUTEUIL",
  CONSUMABLE = "CONSUMABLE",
  CUISINE = "CUISINE",
  DECO = "DECO",
  FRIGO = "FRIGO",
  LITERIE = "LITERIE",
  MOBILIER = "MOBILIER",
  PROPRETE = "PROPRETE",
  SCENE = "SCENE",
  SECU = "SECU",
  SIGNA = "SIGNA",
  OUTILLAGE = "OUTILLAGE",
  TENTE = "TENTE",
  AUTRE = "AUTRES MATOS",
}

export enum BarrieresTypes {
  BARRIERE = "BARRIERE",
}

export enum ElecTypes {
  ALIM = "ALIMENTATION ELECTRIQUE",
  EAU = "EAU",
  ECLAIRAGE = "ECLAIRAGE",
  AUTRE = "AUTRES ELEC",
}
