import {
  APPROVED,
  type Draft,
  type FestivalActivity,
  NOT_ASKING_TO_REVIEW,
  type PreviewDraft,
  type PreviewFestivalActivity,
  REJECTED,
  REVIEWING,
  type ReviewStatus,
  type Reviewer,
  barrieres,
  communication,
  elec,
  humain,
  isDraft,
  matos,
  secu,
  signa,
} from "@overbookd/festival-event";
import type {
  HttpStringified,
  PreviewForCommunication,
  PreviewForSecurity,
} from "@overbookd/http";
import { DRAFT } from "@overbookd/festival-event-constants";
import { CastDraft } from "./draft";
import { CastReviewable } from "./reviewable";
import { castTimeWindowWithDate } from "../cast-time-windows";

export function castActivityWithDate(
  activity: HttpStringified<FestivalActivity>,
): FestivalActivity {
  if (isHttpDraft(activity)) {
    return CastDraft.withDate(activity);
  }
  return CastReviewable.withDate(activity);
}

export function castPreviewForSecurityWithDate(
  activity: HttpStringified<PreviewForSecurity>,
): PreviewForSecurity {
  return {
    ...activity,
    timeWindows: activity.timeWindows.map(castTimeWindowWithDate),
  };
}

export function castPreviewForCommunicationWithDate(
  activity: HttpStringified<PreviewForCommunication>,
): PreviewForCommunication {
  return {
    ...activity,
    timeWindows: activity.timeWindows.map(castTimeWindowWithDate),
  };
}

function isHttpDraft(
  festivalActivity: HttpStringified<FestivalActivity>,
): festivalActivity is HttpStringified<Draft> {
  return festivalActivity.status === DRAFT;
}

export function getActivityReviewerStatus(
  festivalActivity: FestivalActivity,
  reviewer: string,
): ReviewStatus<"FA"> {
  if (isDraft(festivalActivity)) return NOT_ASKING_TO_REVIEW;
  switch (reviewer) {
    case humain:
      return festivalActivity.reviews.humain;
    case signa:
      return festivalActivity.reviews.signa;
    case secu:
      return festivalActivity.reviews.secu;
    case matos:
      return festivalActivity.reviews.matos;
    case elec:
      return festivalActivity.reviews.elec;
    case barrieres:
      return festivalActivity.reviews.barrieres;
    case communication:
      return festivalActivity.reviews.communication;
    default:
      return NOT_ASKING_TO_REVIEW;
  }
}

export function isDraftPreview(
  activity: PreviewFestivalActivity,
): activity is PreviewDraft {
  return activity.status === DRAFT;
}

export function getPreviewReviewStatus(
  preview: PreviewFestivalActivity,
  reviewer: string,
): ReviewStatus<"FA"> {
  if (isDraftPreview(preview)) return NOT_ASKING_TO_REVIEW;

  switch (reviewer) {
    case humain:
      return preview.reviews.humain;
    case signa:
      return preview.reviews.signa;
    case secu:
      return preview.reviews.secu;
    case matos:
      return preview.reviews.matos;
    case elec:
      return preview.reviews.elec;
    case barrieres:
      return preview.reviews.barrieres;
    case communication:
      return preview.reviews.communication;
    default:
      return NOT_ASKING_TO_REVIEW;
  }
}

export function findActivityReviewerStatusByString(
  status: string,
): ReviewStatus<"FA"> | undefined {
  if (!status) return undefined;

  switch (status) {
    case REJECTED:
      return REJECTED;
    case APPROVED:
      return APPROVED;
    case REVIEWING:
      return REVIEWING;
    case NOT_ASKING_TO_REVIEW:
      return NOT_ASKING_TO_REVIEW;
  }
}

export function hasReviewerAlreadyDoneHisActivityReview(
  activity: FestivalActivity,
  reviewer: Reviewer<"FA">,
  status: ReviewStatus<"FA">,
) {
  if (isDraft(activity)) return true;
  switch (reviewer) {
    case humain:
      return activity.reviews.humain === status;
    case matos:
      return activity.reviews.matos === status;
    case elec:
      return activity.reviews.elec === status;
    case signa:
      return activity.reviews.signa === status;
    case secu:
      return activity.reviews.secu === status;
    case barrieres:
      return activity.reviews.barrieres === status;
    case communication:
      return activity.reviews.communication === status;
    default:
      return false;
  }
}
