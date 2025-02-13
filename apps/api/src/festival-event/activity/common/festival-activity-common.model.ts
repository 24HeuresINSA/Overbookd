import {
  Adherent,
  FestivalActivity,
  InquiryOwner,
  SignageCatalogItem,
  PreviewFestivalActivity as PreviewForAll,
} from "@overbookd/festival-event";
import { PreviewForSecurity, PreviewForCommunication } from "@overbookd/http";
import { PreviewForSigna } from "../preview/signa-preview";
import { PreviewForLogistic } from "../preview/logistic-preview";

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
  forSecurity(): Promise<PreviewForSecurity[]>;
  forCommunication(): Promise<PreviewForCommunication[]>;
  forLogistic(): Promise<PreviewForLogistic[]>;
  forSigna(): Promise<PreviewForSigna[]>;
};

export type RemoveFestivalActivities = {
  remove(id: FestivalActivity["id"]): Promise<void>;
};
