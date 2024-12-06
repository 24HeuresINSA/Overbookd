import {
  FestivalActivity,
  PreviewFestivalActivity,
  Draft,
  PreviewDraft,
  InReview,
  InReviewPreview,
  Validated,
  ValidatedPreview,
  Refused,
  RefusedPreview,
} from "./festival-activity";

type FestivalActivityOf<Status extends FestivalActivity["status"]> = Extract<
  FestivalActivity,
  { status: Status }
>;
type PreviewOf<Status extends FestivalActivity["status"]> = Extract<
  PreviewFestivalActivity,
  { status: Status }
>;
type ToPreview<Status extends FestivalActivity["status"]> = (
  festivalActivity: FestivalActivityOf<Status>,
) => PreviewOf<Status>;

export function previewOf<Status extends FestivalActivity["status"]>(
  festivalActivity: FestivalActivityOf<Status>,
): PreviewOf<Status> {
  return PREVIEW_FOR[festivalActivity.status](festivalActivity);
}

const PREVIEW_FOR: {
  [Status in FestivalActivity["status"]]: ToPreview<Status>;
} = {
  IN_REVIEW: inReviewPreviewOf,
  DRAFT: draftPreviewOf,
  VALIDATED: validatedPreviewOf,
  REFUSED: refusedPreviewOf,
};

function draftPreviewOf(draft: Draft): PreviewDraft {
  const supply = draft.supply;
  return {
    id: draft.id,
    name: draft.general.name,
    status: draft.status,
    adherent: draft.inCharge.adherent,
    team: draft.inCharge.team,
    needSupply: supply.electricity.length > 0 || !!supply.water,
  };
}

function inReviewPreviewOf(inReview: InReview): InReviewPreview {
  const supply = inReview.supply;
  return {
    id: inReview.id,
    name: inReview.general.name,
    status: inReview.status,
    adherent: inReview.inCharge.adherent,
    team: inReview.inCharge.team,
    needSupply: supply.electricity.length > 0 || !!supply.water,
    reviews: inReview.reviews,
  };
}

function validatedPreviewOf(validated: Validated): ValidatedPreview {
  const supply = validated.supply;
  return {
    id: validated.id,
    name: validated.general.name,
    status: validated.status,
    adherent: validated.inCharge.adherent,
    team: validated.inCharge.team,
    needSupply: supply.electricity.length > 0 || !!supply.water,
    reviews: validated.reviews,
  };
}

function refusedPreviewOf(refused: Refused): RefusedPreview {
  const supply = refused.supply;
  return {
    id: refused.id,
    name: refused.general.name,
    status: refused.status,
    adherent: refused.inCharge.adherent,
    team: refused.inCharge.team,
    needSupply: supply.electricity.length > 0 || !!supply.water,
    reviews: refused.reviews,
  };
}
