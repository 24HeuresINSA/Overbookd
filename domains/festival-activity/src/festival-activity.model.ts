import {
  Adherent,
  DRAFT,
  DraftFestivalActivityRepresentation,
} from "./creation/draft-festival-activity";

export type FestivalActivity = DraftFestivalActivityRepresentation /* | ... */;

export type PreviewFestivalActivity = {
  id: number;
  name: string;
  status: typeof DRAFT;
  adherent: Adherent;
  team: string | null;
};

export type UpdateFestivalActivity = {
  id: number;
  name: string;
};
