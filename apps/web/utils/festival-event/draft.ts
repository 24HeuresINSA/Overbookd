import { Draft } from "@overbookd/festival-activity";
import { HttpStringified } from "../types/http";
import { castTimeWindowWithDate } from "./cast-time-windows";

export class CastDraft {
  static withDate(draft: HttpStringified<Draft>): Draft {
    return {
      ...draft,
      general: this.generalWithDate(draft.general),
      inquiry: this.inquiryWithDate(draft.inquiry),
      feedbacks: this.feedbacksWithDate(draft.feedbacks),
    };
  }

  private static generalWithDate(
    general: HttpStringified<Draft["general"]>,
  ): Draft["general"] {
    const timeWindows = general.timeWindows.map(castTimeWindowWithDate);

    return { ...general, timeWindows };
  }

  private static inquiryWithDate(
    inquiry: HttpStringified<Draft["inquiry"]>,
  ): Draft["inquiry"] {
    const timeWindows = inquiry.timeWindows.map(castTimeWindowWithDate);

    return { ...inquiry, timeWindows };
  }

  private static feedbacksWithDate(
    feedbacks: HttpStringified<Draft["feedbacks"]>,
  ): Draft["feedbacks"] {
    return feedbacks.map((feedback) => ({
      ...feedback,
      createdAt: new Date(feedback.createdAt),
    }));
  }
}
