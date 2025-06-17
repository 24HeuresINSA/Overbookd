export type Sleeper = {
  name: string;
  id?: number;
  wakeupTime: Date;
  comment?: string;
};

export type Room = {
  label: string;
};

export type AboutBed = {
  room: Room;
  label: string;
};

export type EmptyBed = {
  id: number;
  bed: AboutBed;
};

export type OccupiedBed = EmptyBed & {
  sleeper: Sleeper;
};

export type Bed = EmptyBed | OccupiedBed;

export function isOccupied(bed: Bed): bed is OccupiedBed {
  return "sleeper" in bed;
}

export function isEmpty(bed: Bed): bed is EmptyBed {
  return !("sleeper" in bed);
}
