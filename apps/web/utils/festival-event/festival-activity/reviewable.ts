import type {
  FestivalActivityReviewable,
  InquiryWithRequests,
  PublicGeneral,
  FestivalActivityKeyEvent as KeyEvent,
} from "@overbookd/festival-event";
import type { HttpStringified } from "@overbookd/http";
import { castTimeWindowWithDate } from "../cast-time-windows";
import { withAtLeastOneTimeWindowWithDate } from "../cast-time-windows";

function isPublic(
  general: HttpStringified<FestivalActivityReviewable["general"]>,
): general is HttpStringified<PublicGeneral> {
  return general.toPublish === true;
}

function hasRequests(
  inquiry: HttpStringified<FestivalActivityReviewable["inquiry"]>,
): inquiry is HttpStringified<InquiryWithRequests> {
  const { barriers, electricity, gears } = inquiry;
  const requests = barriers.length + electricity.length + gears.length;
  return inquiry.timeWindows.length > 0 && requests > 0;
}

export class CastReviewable {
  static withDate(
    reviewable: HttpStringified<FestivalActivityReviewable>,
  ): FestivalActivityReviewable {
    return {
      ...reviewable,
      general: this.generalWithDate(reviewable.general),
      inquiry: this.inquiryWithDate(reviewable.inquiry),
      feedbacks: this.feedbacksWithDate(reviewable.feedbacks),
      history: this.historyWithDate(reviewable.history),
    };
  }

  private static generalWithDate(
    general: HttpStringified<FestivalActivityReviewable["general"]>,
  ): FestivalActivityReviewable["general"] {
    if (isPublic(general)) {
      return withAtLeastOneTimeWindowWithDate(general);
    }

    const timeWindows = general.timeWindows.map(castTimeWindowWithDate);
    return { ...general, timeWindows };
  }

  private static inquiryWithDate(
    inquiry: HttpStringified<FestivalActivityReviewable["inquiry"]>,
  ): FestivalActivityReviewable["inquiry"] {
    if (hasRequests(inquiry)) {
      return withAtLeastOneTimeWindowWithDate(inquiry);
    }

    const timeWindows = inquiry.timeWindows.map(castTimeWindowWithDate);
    return { ...inquiry, timeWindows };
  }

  private static feedbacksWithDate(
    feedbacks: HttpStringified<FestivalActivityReviewable["feedbacks"]>,
  ): FestivalActivityReviewable["feedbacks"] {
    return feedbacks.map((feedback) => ({
      ...feedback,
      publishedAt: new Date(feedback.publishedAt),
    }));
  }

  private static historyWithDate(
    history: HttpStringified<KeyEvent[]>,
  ): KeyEvent[] {
    return history.map((event) => ({ ...event, at: new Date(event.at) }));
  }
}
