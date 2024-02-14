import {
  Reviewable,
  InquiryWithRequests,
  PublicGeneral,
  TimeWindow,
  FestivalActivityKeyEvent as KeyEvent,
} from "@overbookd/festival-event";
import { HttpStringified } from "@overbookd/http";
import { FilledArray } from "@overbookd/list";
import { castTimeWindowWithDate } from "../cast-time-windows";

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

export class CastReviewable {
  static withDate(reviewable: HttpStringified<Reviewable>): Reviewable {
    return {
      ...reviewable,
      general: this.generalWithDate(reviewable.general),
      inquiry: this.inquiryWithDate(reviewable.inquiry),
      feedbacks: this.feedbacksWithDate(reviewable.feedbacks),
      history: this.historyWithDate(reviewable.history),
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

  private static historyWithDate(
    history: HttpStringified<KeyEvent[]>,
  ): KeyEvent[] {
    return history.map((event) => ({ ...event, at: new Date(event.at) }));
  }
}

type WithTimeWindows = {
  timeWindows: FilledArray<TimeWindow>;
};
type WithStringifiedTimeWindows = HttpStringified<WithTimeWindows>;

function withAtLeastOneTimeWindowWithDate<T extends WithStringifiedTimeWindows>(
  hasAtLeastOneTimeWindow: T,
): T & WithTimeWindows {
  const [timeWindow, ...others] = hasAtLeastOneTimeWindow.timeWindows;
  const first = castTimeWindowWithDate(timeWindow);
  const timeWindows: FilledArray<TimeWindow> = [
    first,
    ...others.map(castTimeWindowWithDate),
  ];

  return { ...hasAtLeastOneTimeWindow, timeWindows };
}
