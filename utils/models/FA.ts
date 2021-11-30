import { FT } from "~/utils/models/FT";

export interface FA {
  count?: number;
  status: string;
  general?: {
    name: string;
    type: string;
  };
  equipments: { _id: string; name: string; required: number }[];
  timeframes: { start: Date; end: Date; name: string }[];
  validated: String[];
  refused: String[];
  comments: { time: Date; text: string; validator: string; topic?: string }[];
  FTs: FT[];
  isValid: boolean;
  securityPasses: SecurityPass[];
  signalisation: Signalisation[];
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
