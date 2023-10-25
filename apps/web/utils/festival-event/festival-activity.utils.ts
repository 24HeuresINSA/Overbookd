import {
  DRAFT,
  DraftFestivalActivityRepresentation,
  FestivalActivityRepresentation,
  InReviewFestivalActivityRepresentation,
  InReviewInquirySectionWithRequests,
  InReviewPrivateGeneralSection,
} from "@overbookd/festival-activity";
import { HttpStringified } from "../types/http";
import { IProvidePeriod } from "@overbookd/period";

export function castActivityWithDate(
  activity: HttpStringified<FestivalActivityRepresentation>,
): FestivalActivityRepresentation {
  if (isDraft(activity)) {
    return Draft.castActivityWithDate(activity);
  }
  return InReview.castActivityWithDate(activity);
}

function isDraft(
  festivalActivity: HttpStringified<FestivalActivityRepresentation>,
): festivalActivity is HttpStringified<DraftFestivalActivityRepresentation> {
  return festivalActivity.status === DRAFT;
}

type DraftGeneral = DraftFestivalActivityRepresentation["general"];
type DraftInquiry = DraftFestivalActivityRepresentation["inquiry"];

class Draft {
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

type InReviewGeneral = InReviewFestivalActivityRepresentation["general"];
type InReviewInquiry = InReviewFestivalActivityRepresentation["inquiry"];

function isPrivate(
  general: HttpStringified<InReviewGeneral>,
): general is HttpStringified<InReviewPrivateGeneralSection> {
  return general.toPublish === false;
}

function hasRequests(
  inquiry: HttpStringified<InReviewInquiry>,
): inquiry is HttpStringified<InReviewInquirySectionWithRequests> {
  const { barriers, electricity, gears } = inquiry;
  const requests = barriers.length + electricity.length + gears.length;
  return inquiry.timeWindows.length > 0 && requests > 0;
}

class InReview {
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
    if (isPrivate(general)) {
      const timeWindows = general.timeWindows.map(castTimeWindowWithDate);
      return {
        ...general,
        timeWindows,
      };
    }

    return castAtLeastOneTimeWindowWithDate(general);
  }

  private static castInquirySectionWithDate(
    inquiry: HttpStringified<InReviewInquiry>,
  ): InReviewInquiry {
    if (hasRequests(inquiry)) {
      return castAtLeastOneTimeWindowWithDate(inquiry);
    }

    inquiry.timeWindows;
    const timeWindows = inquiry.timeWindows.map(castTimeWindowWithDate);
    return {
      ...inquiry,
      timeWindows,
    };
  }
}

function castTimeWindowWithDate(
  timeWindow: HttpStringified<IProvidePeriod>,
): IProvidePeriod {
  return {
    ...timeWindow,
    start: new Date(timeWindow.start),
    end: new Date(timeWindow.end),
  };
}

type WithTimeWindows = {
  timeWindows: [IProvidePeriod, ...IProvidePeriod[]];
};

type WithStringifiedTimeWindows = HttpStringified<WithTimeWindows>;

function castAtLeastOneTimeWindowWithDate<T extends WithStringifiedTimeWindows>(
  hasAtLeastOneTimeWindow: T,
): T & WithTimeWindows {
  const [timeWindow, ...others] = hasAtLeastOneTimeWindow.timeWindows;
  const first = castTimeWindowWithDate(timeWindow);
  const timeWindows: [IProvidePeriod, ...IProvidePeriod[]] = [
    first,
    ...others.map(castTimeWindowWithDate),
  ];

  return { ...hasAtLeastOneTimeWindow, timeWindows };
}
