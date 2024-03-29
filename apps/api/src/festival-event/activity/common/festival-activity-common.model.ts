import {
  Adherent,
  FestivalActivity,
  InquiryOwner,
  SignageCatalogItem,
} from "@overbookd/festival-event";
import {
  PreviewForSecurity,
  PreviewForCommunication,
  PreviewForLogistic,
} from "@overbookd/http";

export type Adherents = {
  find(id: number): Promise<Adherent | null>;
};

export type CatalogSignages = {
  find(id: number): Promise<SignageCatalogItem | null>;
};

export type Gear = {
  slug: string;
  name: string;
  owner: InquiryOwner;
};

export type Inquiries = {
  find(slug: string): Promise<Gear | null>;
};

export type Previews = {
  forSecurity(): Promise<PreviewForSecurity[]>;
  forCommunication(): Promise<PreviewForCommunication[]>;
  forLogistic(): Promise<PreviewForLogistic[]>;
};

export type RemoveFestivalActivities = {
  remove(id: FestivalActivity["id"]): Promise<void>;
};
