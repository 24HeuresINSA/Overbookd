import {
  Adherent,
  DRAFT,
  DraftFestivalActivity,
} from "./creation/draft-festival-activity";

export type FestivalActivity = DraftFestivalActivity /* | ... */;

export type PreviewFestivalActivity = {
  id: number;
  name: string;
  status: typeof DRAFT;
  adherent: Adherent;
  team: string | null;
};
