import {
  Adherent,
  DRAFT,
  DraftFestivalActivity,
  DraftFestivalActivityRepresentation,
} from "./creation/draft-festival-activity";

export type FestivalActivity = DraftFestivalActivity /* | ... */;

export type FestivalActivityRepresentation =
  DraftFestivalActivityRepresentation /* | ... */;

export type PreviewFestivalActivity = {
  id: number;
  name: string;
  status: typeof DRAFT;
  adherent: Adherent;
  team?: string | null;
};

export type CreateFestivalActivityForm = {
  name: string;
};
