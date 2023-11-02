import {
  InReviewFestivalActivityRepresentation,
  InquirySectionWithRequests,
  PublicGeneralSection,
  TimeWindow,
} from "@overbookd/festival-activity";
import { HttpStringified } from "../types/http";
import { castTimeWindowWithDate } from "./cast-time-windows";

type InReviewGeneral = InReviewFestivalActivityRepresentation["general"];
type InReviewInquiry = InReviewFestivalActivityRepresentation["inquiry"];

function isPublic(
  general: HttpStringified<InReviewGeneral>,
): general is HttpStringified<PublicGeneralSection> {
  return general.toPublish === true;
}

function hasRequests(
  inquiry: HttpStringified<InReviewInquiry>,
): inquiry is HttpStringified<InquirySectionWithRequests> {
  const { barriers, electricity, gears } = inquiry;
  const requests = barriers.length + electricity.length + gears.length;
  return inquiry.timeWindows.length > 0 && requests > 0;
}

export class InReview {
  static castActivityWithDate(
    inReview: HttpStringified<InReviewFestivalActivityRepresentation>,
  ): InReviewFestivalActivityRepresentation {
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
    general: HttpStringified<InReviewGeneral>,
  ): InReviewGeneral {
    if (isPublic(general)) {
      return castAtLeastOneTimeWindowWithDate(general);
    }

    const timeWindows = general.timeWindows.map(castTimeWindowWithDate);
    return { ...general, timeWindows };
  }

  private static castInquirySectionWithDate(
    inquiry: HttpStringified<InReviewInquiry>,
  ): InReviewInquiry {
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
