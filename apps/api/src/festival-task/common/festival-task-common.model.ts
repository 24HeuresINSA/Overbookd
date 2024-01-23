import {
  Adherent,
  Contact,
  FestivalTask,
  Location,
} from "@overbookd/festival-event";

export type Gear = {
  slug: string;
  name: string;
};

export type FestivalActivities = {
  find(id: number): Promise<FestivalTask["festivalActivity"] | null>;
};

export type Adherents = {
  findOne(id: number): Promise<Adherent | null>;
  findMatching(ids: number[]): Promise<Adherent[]>;
  findContact(id: number): Promise<Contact | null>;
};

export type Locations = {
  find(id: number): Promise<Location | null>;
};

export type Inquiries = {
  find(slug: string): Promise<Gear | null>;
};

export type RemoveFestivalTasks = {
  apply(id: FestivalTask["id"]): Promise<void>;
};
