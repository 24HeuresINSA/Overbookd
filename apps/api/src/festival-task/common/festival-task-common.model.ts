import {
  Adherent,
  Contact,
  FestivalTask,
  Location,
} from "@overbookd/festival-event";

export type FestivalActivities = {
  find(id: number): Promise<FestivalTask["festivalActivity"] | null>;
};

export type Adherents = {
  findOne(id: number): Promise<Adherent | null>;
  findMany(ids: number[]): Promise<Adherent[]>;
  findContact(id: number): Promise<Contact | null>;
};

export type Locations = {
  find(id: number): Promise<Location | null>;
};

export type RemoveFestivalTasks = {
  apply(id: FestivalTask["id"]): Promise<void>;
};
