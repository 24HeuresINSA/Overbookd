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
  timeframes: { start: Date; end: Date }[];

  comments: { time: Date; text: string; validator: string; topic?: string }[];
}

export enum SmallTypes {
  QUINCAILLERIE = "QUINCAILLERIE",
}
