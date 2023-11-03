import {
  InReview,
  InquiryWithRequests,
  PublicGeneral,
  TimeWindow,
} from "@overbookd/festival-activity";
import { HttpStringified } from "../types/http";
import { castTimeWindowWithDate } from "./cast-time-windows";

function isPublic(
  general: HttpStringified<InReview["general"]>,
): general is HttpStringified<PublicGeneral> {
  return general.toPublish === true;
}

function hasRequests(
  inquiry: HttpStringified<InReview["inquiry"]>,
): inquiry is HttpStringified<InquiryWithRequests> {
  const { barriers, electricity, gears } = inquiry;
  const requests = barriers.length + electricity.length + gears.length;
  return inquiry.timeWindows.length > 0 && requests > 0;
}

export class InReviewFormat {
  static castActivityWithDate(inReview: HttpStringified<InReview>): InReview {
    return {
      ...inReview,
      general: this.castGeneralSectionWithDate(inReview.general),
      inquiry: this.castInquirySectionWithDate(inReview.inquiry),
      inCharge: {
        ...inReview.inCharge,
        contractors: [], // TODO remove this when contractors are implemented
      },
    };
  }

  private static castGeneralSectionWithDate(
    general: HttpStringified<InReview["general"]>,
  ): InReview["general"] {
    if (isPublic(general)) {
      return castAtLeastOneTimeWindowWithDate(general);
    }

    const timeWindows = general.timeWindows.map(castTimeWindowWithDate);
    return { ...general, timeWindows };
  }

  private static castInquirySectionWithDate(
    inquiry: HttpStringified<InReview["inquiry"]>,
  ): InReview["inquiry"] {
    if (hasRequests(inquiry)) {
      return castAtLeastOneTimeWindowWithDate(inquiry);
    }

    const timeWindows = inquiry.timeWindows.map(castTimeWindowWithDate);
    return { ...inquiry, timeWindows };
  }
}

type WithTimeWindows = {
  timeWindows: [TimeWindow, ...TimeWindow[]];
};
type WithStringifiedTimeWindows = HttpStringified<WithTimeWindows>;

function castAtLeastOneTimeWindowWithDate<T extends WithStringifiedTimeWindows>(
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
