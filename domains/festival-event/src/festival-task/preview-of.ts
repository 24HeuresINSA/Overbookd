import {
  FestivalTask,
  Draft,
  InReview,
  ReadyToAssign,
  Refused,
  Validated,
  Preview,
  PreviewDraft,
  PreviewInReview,
  PreviewValidated,
  PreviewRefused,
  PreviewReadyToAssign,
} from "./festival-task";

type FestivalTaskOf<Status extends FestivalTask["status"]> = Extract<
  FestivalTask,
  { status: Status }
>;
type PreviewOf<Status extends FestivalTask["status"]> = Extract<
  Preview,
  { status: Status }
>;
type ToPreview<Status extends FestivalTask["status"]> = (
  festivalTask: FestivalTaskOf<Status>,
) => PreviewOf<Status>;

export function previewOf<Status extends FestivalTask["status"]>(
  festivalTask: FestivalTaskOf<Status>,
): PreviewOf<Status> {
  return PREVIEW_FOR[festivalTask.status](festivalTask);
}

const PREVIEW_FOR: {
  [Status in FestivalTask["status"]]: ToPreview<Status>;
} = {
  IN_REVIEW: inReviewPreviewOf,
  DRAFT: draftPreviewOf,
  VALIDATED: validatedPreviewOf,
  REFUSED: refusedPreviewOf,
  READY_TO_ASSIGN: readyToAssignPreviewOf,
};

function draftPreviewOf(draft: Draft): PreviewDraft {
  return {
    id: draft.id,
    name: draft.general.name,
    status: draft.status,
    administrator: draft.general.administrator,
    team: draft.general.team,
  };
}

function inReviewPreviewOf(inReview: InReview): PreviewInReview {
  return {
    id: inReview.id,
    name: inReview.general.name,
    status: inReview.status,
    administrator: inReview.general.administrator,
    team: inReview.general.team,
    reviewer: inReview.reviewer,
    reviews: inReview.reviews,
  };
}

function validatedPreviewOf(validated: Validated): PreviewValidated {
  return {
    id: validated.id,
    name: validated.general.name,
    status: validated.status,
    administrator: validated.general.administrator,
    team: validated.general.team,
    reviewer: validated.reviewer,
    reviews: validated.reviews,
  };
}

function refusedPreviewOf(refused: Refused): PreviewRefused {
  return {
    id: refused.id,
    name: refused.general.name,
    status: refused.status,
    administrator: refused.general.administrator,
    team: refused.general.team,
    reviewer: refused.reviewer,
    reviews: refused.reviews,
  };
}

function readyToAssignPreviewOf(ready: ReadyToAssign): PreviewReadyToAssign {
  return {
    id: ready.id,
    name: ready.general.name,
    status: ready.status,
    administrator: ready.general.administrator,
    team: ready.general.team,
    reviewer: ready.reviewer,
    reviews: ready.reviews,
  };
}
