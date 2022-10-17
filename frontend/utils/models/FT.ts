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
