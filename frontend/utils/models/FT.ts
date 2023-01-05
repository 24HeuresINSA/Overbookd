export enum Status {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  VALIDATED = "VALIDATED",
  REFUSED = "REFUSED",
}

export interface FT {
  id: number;
  name: string;
  status: Status;
  in_charge?: number;
  are_static_time_windows: boolean;
  locations?: number[];
  fa?: number;
  matos_count?: number;
  description?: string;

  validated: String[];
  refused: String[];

  details: {
    locations?: string[];
  };

  equipments: { _id: string; name: string; required: number }[];
  timeframes: {
    start: Date;
    end: Date; //no maximum duration, no check on consistency of data
    required?: requirement[];
    _id: string;
    timed: boolean;
    toSlice?: boolean;
    sliceTime?: number;
  }[];

  comments: { time: Date; text: string; validator: string; topic?: string }[];
}

export type requirement = requirementUser | requirementTeam;

export interface requirementUser {
  type: "user";
  user: {
    _id: string;
    username: string;
  };
}

export interface requirementTeam {
  type: "team";
  team: string;
  amount: number;
}

export interface requirementTeam {
  type: "team";
  team: string;
  amount: number;
}

export enum SmallTypes {
  QUINCAILLERIE = "QUINCAILLERIE",
  OUTILLAGE = "OUTILLAGE",
  CONSUMABLE = "CONSUMABLE",
  PROPRETE = "PROPRETE",
}
