import { Adherent, Contact, FestivalTask } from "@overbookd/festival-event";

export type Gear = {
  slug: string;
  name: string;
};

export type FestivalActivities = {
  find(
    id: FestivalTask["festivalActivity"]["id"],
  ): Promise<FestivalTask["festivalActivity"] | null>;
};

export type Adherents = {
  findOne(id: Adherent["id"]): Promise<Adherent | null>;
  findMatching(ids: Adherent["id"][]): Promise<Adherent[]>;
  findContact(id: Contact["id"]): Promise<Contact | null>;
};

export type Inquiries = {
  find(slug: string): Promise<Gear | null>;
};
