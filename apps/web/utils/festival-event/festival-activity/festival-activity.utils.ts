import {
  DRAFT,
  Draft,
  FestivalActivity,
  NOT_ASKING_TO_REVIEW,
  PreviewFestivalActivity,
  ReviewStatus,
  barrieres,
  communication,
  elec,
  humain,
  isDraft,
  matos,
  secu,
  signa,
} from "@overbookd/festival-event";
import {
  HttpStringified,
  PreviewForCommunication,
  PreviewForSecurity,
} from "@overbookd/http";
import { CastReviewable } from "./reviewable";
import { CastDraft } from "./draft";
import { isDraftPreview } from "./festival-activity.model";
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

export function getActivityReviewStatus(
  festivalActivity: FestivalActivity,
  reviewer: string,
): ReviewStatus {
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

export function getPreviewReviewStatus(
  preview: PreviewFestivalActivity,
  reviewer: string,
): ReviewStatus {
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
