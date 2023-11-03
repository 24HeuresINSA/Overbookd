import { Draft } from "@overbookd/festival-activity";
import { HttpStringified } from "../types/http";
import { castTimeWindowWithDate } from "./cast-time-windows";

export class DraftCast {
  static castActivityWithDate(draft: HttpStringified<Draft>): Draft {
    return {
      ...draft,
      general: this.castGeneralSectionWithDate(draft.general),
      inquiry: this.castInquirySectionWithDate(draft.inquiry),
      inCharge: {
        ...draft.inCharge,
        contractors: [], // TODO remove this when contractors are implemented
      },
    };
  }

  private static castGeneralSectionWithDate(
    general: HttpStringified<Draft["general"]>,
  ): Draft["general"] {
    const timeWindows = general.timeWindows.map(castTimeWindowWithDate);

    return { ...general, timeWindows };
  }

  private static castInquirySectionWithDate(
    inquiry: HttpStringified<Draft["inquiry"]>,
  ): Draft["inquiry"] {
    const timeWindows = inquiry.timeWindows.map(castTimeWindowWithDate);

    return { ...inquiry, timeWindows };
  }
}
