import {
  Reviewable,
  InquiryWithRequests,
  PublicGeneral,
  TimeWindow,
} from "@overbookd/festival-activity";
import { HttpStringified } from "@overbookd/http";
import { castTimeWindowWithDate } from "./cast-time-windows";

function isPublic(
  general: HttpStringified<Reviewable["general"]>,
): general is HttpStringified<PublicGeneral> {
  return general.toPublish === true;
}

function hasRequests(
  inquiry: HttpStringified<Reviewable["inquiry"]>,
): inquiry is HttpStringified<InquiryWithRequests> {
  const { barriers, electricity, gears } = inquiry;
  const requests = barriers.length + electricity.length + gears.length;
  return inquiry.timeWindows.length > 0 && requests > 0;
}

export class CastInReview {
  static withDate(inReview: HttpStringified<Reviewable>): Reviewable {
    return {
      ...inReview,
      general: this.generalWithDate(inReview.general),
      inquiry: this.inquiryWithDate(inReview.inquiry),
      feedbacks: this.feedbacksWithDate(inReview.feedbacks),
    };
  }

  private static generalWithDate(
    general: HttpStringified<Reviewable["general"]>,
  ): Reviewable["general"] {
    if (isPublic(general)) {
      return withAtLeastOneTimeWindowWithDate(general);
    }

    const timeWindows = general.timeWindows.map(castTimeWindowWithDate);
    return { ...general, timeWindows };
  }

  private static inquiryWithDate(
    inquiry: HttpStringified<Reviewable["inquiry"]>,
  ): Reviewable["inquiry"] {
    if (hasRequests(inquiry)) {
      return withAtLeastOneTimeWindowWithDate(inquiry);
    }

    const timeWindows = inquiry.timeWindows.map(castTimeWindowWithDate);
    return { ...inquiry, timeWindows };
  }

  private static feedbacksWithDate(
    feedbacks: HttpStringified<Reviewable["feedbacks"]>,
  ): Reviewable["feedbacks"] {
    return feedbacks.map((feedback) => ({
      ...feedback,
      publishedAt: new Date(feedback.publishedAt),
    }));
  }
}

type WithTimeWindows = {
  timeWindows: [TimeWindow, ...TimeWindow[]];
};
type WithStringifiedTimeWindows = HttpStringified<WithTimeWindows>;

function withAtLeastOneTimeWindowWithDate<T extends WithStringifiedTimeWindows>(
  hasAtLeastOneTimeWindow: T,
): T & WithTimeWindows {
  const [timeWindow, ...others] = hasAtLeastOneTimeWindow.timeWindows;
  const first = castTimeWindowWithDate(timeWindow);
  const timeWindows: [TimeWindow, ...TimeWindow[]] = [
    first,
    ...others.map(castTimeWindowWithDate),
  ];

  return { ...hasAtLeastOneTimeWindow, timeWindows };
}
