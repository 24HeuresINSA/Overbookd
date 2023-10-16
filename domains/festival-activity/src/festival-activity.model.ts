import {
  Adherent,
  BaseFestivalActivity,
} from "./creation/draft-festival-activity";

export type FestivalActivity = BaseFestivalActivity & {
  status: FaStatus;
};

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
