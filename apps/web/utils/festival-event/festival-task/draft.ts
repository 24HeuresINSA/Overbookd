import { Draft, FestivalTaskDraft } from "@overbookd/festival-event";
import { HttpStringified } from "@overbookd/http";
import { castTimeWindowWithDate } from "../cast-time-windows";

export class CastDraft {
  static withDate(
    draft: HttpStringified<FestivalTaskDraft>,
  ): FestivalTaskDraft {
    return {
      ...draft,
      festivalActivity: this.castActivityWithDate(draft.festivalActivity),
      mobilizations: this.mobilizationsWithDate(draft.mobilizations),
      feedbacks: this.feedbacksWithDate(draft.feedbacks),
      history: this.historyWithDate(draft.history),
    };
  }

  private static castActivityWithDate(
    festivalActivity: HttpStringified<FestivalTaskDraft["festivalActivity"]>,
  ): FestivalTaskDraft["festivalActivity"] {
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
    mobilizations: HttpStringified<FestivalTaskDraft["mobilizations"]>,
  ): FestivalTaskDraft["mobilizations"] {
    return mobilizations.map((mobilization) => ({
      ...mobilization,
      ...castTimeWindowWithDate(mobilization),
    }));
  }

  private static feedbacksWithDate(
    feedbacks: HttpStringified<FestivalTaskDraft["feedbacks"]>,
  ): Draft["feedbacks"] {
    return feedbacks.map((feedback) => ({
      ...feedback,
      publishedAt: new Date(feedback.publishedAt),
    }));
  }

  private static historyWithDate(
    history: HttpStringified<FestivalTaskDraft["history"]>,
  ): FestivalTaskDraft["history"] {
    return history.map((event) => ({ ...event, at: new Date(event.at) }));
  }
}
