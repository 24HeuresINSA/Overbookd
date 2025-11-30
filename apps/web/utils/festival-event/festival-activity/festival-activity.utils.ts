import {
  type Draft,
  type FestivalActivity,
  type PreviewDraft,
  type PreviewFestivalActivity,
  type ReviewStatus,
  type Reviewer,
  isDraft,
} from "@overbookd/festival-event";
import type {
  HttpStringified,
  PreviewForCommunication,
  PreviewForSecurity,
} from "@overbookd/http";
import {
  APPROVED,
  DRAFT,
  NOT_ASKING_TO_REVIEW,
  REJECTED,
  REVIEWING,
} from "@overbookd/festival-event-constants";
import { CastDraft } from "./draft";
import { CastReviewable } from "./reviewable";
import { castTimeWindowWithDate } from "../cast-time-windows";
import {
  BARRIERES,
  COMMUNICATION,
  HUMAIN,
  LOG_ELEC,
  LOG_MATOS,
  SECU,
  SIGNA,
} from "@overbookd/team-constants";

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
    case HUMAIN:
      return festivalActivity.reviews.humain;
    case SIGNA:
      return festivalActivity.reviews.signa;
    case SECU:
      return festivalActivity.reviews.secu;
    case LOG_MATOS:
      return festivalActivity.reviews.matos;
    case LOG_ELEC:
      return festivalActivity.reviews.elec;
    case BARRIERES:
      return festivalActivity.reviews.barrieres;
    case COMMUNICATION:
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
    case HUMAIN:
      return preview.reviews.humain;
    case SIGNA:
      return preview.reviews.signa;
    case SECU:
      return preview.reviews.secu;
    case LOG_MATOS:
      return preview.reviews.matos;
    case LOG_ELEC:
      return preview.reviews.elec;
    case BARRIERES:
      return preview.reviews.barrieres;
    case COMMUNICATION:
      return preview.reviews.communication;
    default:
      return NOT_ASKING_TO_REVIEW;
  }
}

export function findActivityReviewerStatusByString(
  status: string,
): ReviewStatus<"FA"> | undefined {
  switch (status) {
    case REJECTED:
    case APPROVED:
    case REVIEWING:
    case NOT_ASKING_TO_REVIEW:
      return status;
    default:
      return undefined;
  }
}

export function hasReviewerAlreadyDoneHisActivityReview(
  activity: FestivalActivity,
  reviewer: Reviewer<"FA">,
  status: ReviewStatus<"FA">,
) {
  if (isDraft(activity)) return true;
  switch (reviewer) {
    case HUMAIN:
      return activity.reviews.humain === status;
    case LOG_MATOS:
      return activity.reviews.matos === status;
    case LOG_ELEC:
      return activity.reviews.elec === status;
    case SIGNA:
      return activity.reviews.signa === status;
    case SECU:
      return activity.reviews.secu === status;
    case BARRIERES:
      return activity.reviews.barrieres === status;
    case COMMUNICATION:
      return activity.reviews.communication === status;
    default:
      return false;
  }
}
