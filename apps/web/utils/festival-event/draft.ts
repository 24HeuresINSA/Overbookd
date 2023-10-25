import { DraftFestivalActivityRepresentation } from "@overbookd/festival-activity";
import { HttpStringified } from "../types/http";

type DraftGeneral = DraftFestivalActivityRepresentation["general"];
type DraftInquiry = DraftFestivalActivityRepresentation["inquiry"];

export class Draft {
  static castActivityWithDate(
    draft: HttpStringified<DraftFestivalActivityRepresentation>,
  ): DraftFestivalActivityRepresentation {
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
    general: HttpStringified<DraftGeneral>,
  ): DraftGeneral {
    const timeWindows = general.timeWindows.map((tw) => ({
      ...tw,
      start: new Date(tw.start),
      end: new Date(tw.end),
    }));
    return {
      ...general,
      timeWindows,
    };
  }

  private static castInquirySectionWithDate(
    inquiry: HttpStringified<DraftInquiry>,
  ): DraftInquiry {
    const timeWindows = inquiry.timeWindows.map((tw) => ({
      ...tw,
      start: new Date(tw.start),
      end: new Date(tw.end),
    }));
    return {
      ...inquiry,
      timeWindows,
    };
  }
}
