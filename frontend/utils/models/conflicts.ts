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
  tf1: string;
  ts1: string;
  type: "TS";
  user: User;
}

export interface AvailabilityConflict {
  tf1: string;
  type: "availability";
  user: User;
}

export type Conflict<T = string> =
  | TFConflict<T>
  | TSConflict
  | AvailabilityConflict;

export function isAvailabilityConflict(
  conflict: Conflict
): conflict is AvailabilityConflict {
  return conflict.type === "availability";
}

export function isTFConflict(conflict: Conflict): conflict is TFConflict {
  return conflict.type === "TF";
}

export function isTSConflict(conflict: Conflict): conflict is TSConflict {
  return conflict.type === "TS";
}
