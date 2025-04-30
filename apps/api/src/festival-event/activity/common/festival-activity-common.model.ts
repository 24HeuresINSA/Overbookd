import {
  Adherent,
  FestivalActivity,
  InquiryOwner,
  SignageCatalogItem,
  PreviewFestivalActivity as PreviewForAll,
} from "@overbookd/festival-event";
import {
  PreviewForSecurity,
  PreviewForCommunication,
  PreviewForLogistic,
  ActivityGearSearchOptions,
} from "@overbookd/http";
import { PreviewForSigna } from "../preview/signa-preview";

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
  byAdherentId(id: number): Promise<PreviewForAll[]>;
  forLogistic(
    searchOptions: ActivityGearSearchOptions,
  ): Promise<PreviewForLogistic[]>;
  forSecurity(): Promise<PreviewForSecurity[]>;
  forCommunication(): Promise<PreviewForCommunication[]>;
  forSigna(): Promise<PreviewForSigna[]>;
};

export type RemoveFestivalActivities = {
  remove(id: FestivalActivity["id"]): Promise<void>;
};
