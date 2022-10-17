import { FT } from "~/utils/models/FT";

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
