import type {
  FestivalActivityDraft,
  FestivalActivity,
} from "@overbookd/festival-event";
import type { HttpStringified } from "@overbookd/http";
import { castTimeWindowWithDate } from "../cast-time-windows";

export class CastDraft {
  static withDate(
    draft: HttpStringified<FestivalActivityDraft>,
  ): FestivalActivityDraft {
    return {
      ...draft,
      general: this.generalWithDate(draft.general),
      inquiry: this.inquiryWithDate(draft.inquiry),
      feedbacks: this.feedbacksWithDate(draft.feedbacks),
      history: this.historyWithDate(draft.history),
    };
  }

  private static generalWithDate(
    general: HttpStringified<FestivalActivityDraft["general"]>,
  ): FestivalActivityDraft["general"] {
    const timeWindows = general.timeWindows.map(castTimeWindowWithDate);

    return { ...general, timeWindows };
  }

  private static inquiryWithDate(
    inquiry: HttpStringified<FestivalActivityDraft["inquiry"]>,
  ): FestivalActivityDraft["inquiry"] {
    const timeWindows = inquiry.timeWindows.map(castTimeWindowWithDate);

    return { ...inquiry, timeWindows };
  }

  private static feedbacksWithDate(
    feedbacks: HttpStringified<FestivalActivityDraft["feedbacks"]>,
  ): FestivalActivityDraft["feedbacks"] {
    return feedbacks.map((feedback) => ({
      ...feedback,
      publishedAt: new Date(feedback.publishedAt),
    }));
  }

  private static historyWithDate(
    history: HttpStringified<FestivalActivity["history"]>,
  ): FestivalActivity["history"] {
    return history.map((event) => ({ ...event, at: new Date(event.at) }));
  }
}
