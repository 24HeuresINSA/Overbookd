import { DraftInCharge, InCharge } from "./sections/in-charge";
import { DraftGeneral, General } from "./sections/general";
import { DraftSigna, Signa } from "./sections/signa";
import { Supply } from "./sections/supply";
import { Inquiry } from "./sections/inquiry";
import { Reviews } from "./sections/reviews";

export const DRAFT = "DRAFT";
export const IN_REVIEW = "IN_REVIEW";

type Security = {
  specialNeed: string | null;
};

export type Draft = {
  id: number;
  status: typeof DRAFT;
  general: DraftGeneral;
  inCharge: DraftInCharge;
  signa: DraftSigna;
  security: Security;
  supply: Supply;
  inquiry: Inquiry;
};

export type InReview = {
  id: number;
  status: typeof IN_REVIEW;
  general: General;
  inCharge: InCharge;
  signa: Signa;
  security: Security;
  supply: Supply;
  inquiry: Inquiry;
  reviews: Reviews;
};

export type FestivalActivity = Draft | InReview;

export type PreviewInReview = {
  id: InReview["id"];
  name: InReview["general"]["name"];
  status: InReview["status"];
  adherent: InReview["inCharge"]["adherent"];
  team: InReview["inCharge"]["team"];
  reviews: InReview["reviews"];
};

export type PreviewDraft = {
  id: Draft["id"];
  name: Draft["general"]["name"];
  status: Draft["status"];
  adherent: Draft["inCharge"]["adherent"];
  team: Draft["inCharge"]["team"];
};

export type PreviewFestivalActivity = PreviewInReview | PreviewDraft;

export type CreateFestivalActivityForm = {
  name: string;
};

export function isDraft(activity: FestivalActivity): activity is Draft {
  return activity.status === DRAFT;
}
