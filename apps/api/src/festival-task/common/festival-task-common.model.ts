import { Adherent, FestivalTask } from "@overbookd/festival-event";

export type FestivalActivities = {
  find(id: number): Promise<FestivalTask["festivalActivity"] | null>;
};

export type Adherents = {
  find(id: number): Promise<Adherent | null>;
};

export type RemoveFestivalTasks = {
  apply(id: FestivalTask["id"]): Promise<void>;
};
