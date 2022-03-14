declare interface User {
  _id: string;
  firstname: string;
  lastname: string;
}

export interface TFConflict<T = string> {
  tf1: T;
  tf2: T;
  type: "TF";
  user: User;
}
export interface TSConflict {
  ts1: string;
  ts2: string;
  type: "TS";
  user: User;
}

export interface availabilityConflict {
  tf1: string;
  type: "availability";
  user: User;
}

export type Conflict<T = string> =
  | TFConflict<T>
  | TSConflict
  | availabilityConflict;
