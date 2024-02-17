import { DraftWithConflicts as Draft, HttpStringified } from "@overbookd/http";
import { castTimeWindowWithDate } from "../cast-time-windows";

export class CastDraft {
  static withDate(draft: HttpStringified<Draft>): Draft {
    return {
      ...draft,
      festivalActivity: this.castActivityWithDate(draft.festivalActivity),
      mobilizations: this.mobilizationsWithDate(draft.mobilizations),
      feedbacks: this.feedbacksWithDate(draft.feedbacks),
      history: this.historyWithDate(draft.history),
    };
  }

  private static castActivityWithDate(
    festivalActivity: HttpStringified<Draft["festivalActivity"]>,
  ): Draft["festivalActivity"] {
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
    mobilizations: HttpStringified<Draft["mobilizations"]>,
  ): Draft["mobilizations"] {
    return mobilizations.map((mobilization) => ({
      ...mobilization,
      ...castTimeWindowWithDate(mobilization),
    }));
  }

  private static feedbacksWithDate(
    feedbacks: HttpStringified<Draft["feedbacks"]>,
  ): Draft["feedbacks"] {
    return feedbacks.map((feedback) => ({
      ...feedback,
      publishedAt: new Date(feedback.publishedAt),
    }));
  }

  private static historyWithDate(
    history: HttpStringified<Draft["history"]>,
  ): Draft["history"] {
    return history.map((event) => ({ ...event, at: new Date(event.at) }));
  }
}
