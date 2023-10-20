import {
  DraftFestivalActivity,
  DraftFestivalActivityRepresentation,
  InChargeSection,
} from "./creation/draft-festival-activity";

export type FestivalActivity = DraftFestivalActivity /* | ... */;

export type FestivalActivityRepresentation =
  DraftFestivalActivityRepresentation /* | ... */;

export type PreviewFestivalActivity = {
  id: FestivalActivityRepresentation["id"];
  name: FestivalActivityRepresentation["general"]["name"];
  status: FestivalActivityRepresentation["status"];
  adherent: FestivalActivityRepresentation["inCharge"]["adherent"];
  team: FestivalActivityRepresentation["inCharge"]["team"];
};

export type CreateFestivalActivityForm = {
  name: string;
};

export type InChargeSectionForm = Omit<InChargeSection, "adherent"> & {
  adherentId: number;
};
