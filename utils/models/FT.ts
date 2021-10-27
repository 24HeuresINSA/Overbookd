export interface FT {
  _id: string;
  FA: number;
  count?: number;
  general?: {
    name: string;
  };
  status: string;
  equipments: { _id: string; name: string; required: number }[];
  timeframes: { start: Date; end: Date }[];
  validated: String[];
  refused: String[];
  comments: { time: Date; text: string; validator: string; topic?: string }[];
}
