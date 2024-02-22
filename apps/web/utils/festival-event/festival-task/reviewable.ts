import {
  HttpStringified,
  ReviewableWithConflicts as Reviewable,
} from "@overbookd/http";
import { castTimeWindowWithDate } from "../cast-time-windows";

export class CastReviewable {
  static withDate(reviewable: HttpStringified<Reviewable>): Reviewable {
    return {
      ...reviewable,
      festivalActivity: this.castActivityWithDate(reviewable.festivalActivity),
      mobilizations: this.mobilizationsWithDate(reviewable.mobilizations),
      feedbacks: this.feedbacksWithDate(reviewable.feedbacks),
      history: this.historyWithDate(reviewable.history),
    };
  }

  private static castActivityWithDate(
    festivalActivity: HttpStringified<Reviewable["festivalActivity"]>,
  ): Reviewable["festivalActivity"] {
    return {
      ...festivalActivity,
      timeWindows: festivalActivity.timeWindows.map(castTimeWindowWithDate),
      inquiry: {
        ...festivalActivity.inquiry,
        timeWindows: festivalActivity.inquiry.timeWindows.map(
          castTimeWindowWithDate,
        ),
      },
    };
  }

  private static mobilizationsWithDate(
    mobilizations: HttpStringified<Reviewable["mobilizations"]>,
  ): Reviewable["mobilizations"] {
    return mobilizations.map((mobilization) => ({
      ...mobilization,
      ...castTimeWindowWithDate(mobilization),
    }));
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
    history: HttpStringified<Reviewable["history"]>,
  ): Reviewable["history"] {
    return history.map((event) => ({ ...event, at: new Date(event.at) }));
  }
}
