import { FestivalTaskInReview as InReview } from "@overbookd/festival-event";
import { HttpStringified } from "@overbookd/http";
import { castTimeWindowWithDate } from "../cast-time-windows";

export class CastInReview {
  static withDate(inReview: HttpStringified<InReview>): InReview {
    return {
      ...inReview,
      festivalActivity: this.castActivityWithDate(inReview.festivalActivity),
      mobilizations: this.mobilizationsWithDate(inReview.mobilizations),
      feedbacks: this.feedbacksWithDate(inReview.feedbacks),
      history: this.historyWithDate(inReview.history),
    };
  }

  private static castActivityWithDate(
    festivalActivity: HttpStringified<InReview["festivalActivity"]>,
  ): InReview["festivalActivity"] {
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
    mobilizations: HttpStringified<InReview["mobilizations"]>,
  ): InReview["mobilizations"] {
    return mobilizations.map((mobilization) => ({
      ...mobilization,
      ...castTimeWindowWithDate(mobilization),
    }));
  }

  private static feedbacksWithDate(
    feedbacks: HttpStringified<InReview["feedbacks"]>,
  ): InReview["feedbacks"] {
    return feedbacks.map((feedback) => ({
      ...feedback,
      publishedAt: new Date(feedback.publishedAt),
    }));
  }

  private static historyWithDate(
    history: HttpStringified<InReview["history"]>,
  ): InReview["history"] {
    return history.map((event) => ({ ...event, at: new Date(event.at) }));
  }
}
