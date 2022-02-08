export interface FT {
  _id: string;
  FA: number;
  count: number;

  status: string;
  validated: String[];
  refused: String[];

  general?: {
    name?: string;
  };
  details: {
    locations?: string[];
  };

  equipments: { _id: string; name: string; required: number }[];
  timeframes: { start: Date; end: Date; required?: requirement[] }[];

  comments: { time: Date; text: string; validator: string; topic?: string }[];
}

export interface requirement {
  type: "equipment" | "user" | "team";
  amount: number;
  equipment?: string;
  user?: {
    _id: string;
    username: string;
  };
  team?: string;
}

export enum SmallTypes {
  QUINCAILLERIE = "QUINCAILLERIE",
  OUTILLAGE = "OUTILLAGE",
  CONSUMABLE = "CONSUMABLE",
}
