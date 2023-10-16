import {
  Adherent,
  BaseFestivalActivity,
  DraftFestivalActivityRepresentation,
} from "./creation/draft-festival-activity";

type InReviewFestivalActivity = BaseFestivalActivity & {
  status: typeof IN_REVIEW;
};

type ApprovedFestivalActivity = BaseFestivalActivity & {
  status: typeof APPROVED;
};

type RejectedFestivalActivity = BaseFestivalActivity & {
  status: typeof REJECTED;
};

export type FestivalActivity =
  | DraftFestivalActivityRepresentation
  | InReviewFestivalActivity
  | ApprovedFestivalActivity
  | RejectedFestivalActivity;

export type LiteFestivalActivity = {
  id: number;
  name: string;
  status: FaStatus;
  adherent: Adherent;
  team: string | null;
};

const DRAFT = "DRAFT";
const IN_REVIEW = "IN_REVIEW";
const APPROVED = "APPROVED";
const REJECTED = "REJECTED";

export const faStatuses: Record<FaStatus, FaStatus> = {
  DRAFT,
  IN_REVIEW,
  APPROVED,
  REJECTED,
};

export type FaStatus =
  | typeof DRAFT
  | typeof IN_REVIEW
  | typeof APPROVED
  | typeof REJECTED;
