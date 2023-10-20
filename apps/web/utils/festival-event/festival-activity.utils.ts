import { FestivalActivityRepresentation } from "@overbookd/festival-activity";
import { HttpStringified } from "../types/http";

export function castActivityWithDate(
  activity: HttpStringified<FestivalActivityRepresentation>,
): FestivalActivityRepresentation {
  return {
    ...activity,
    general: castGeneralSectionWithDate(activity.general),
    inquiry: castInquirySectionWithDate(activity.inquiry),
    inCharge: {
      ...activity.inCharge,
      contractors: [], // TODO remove this when contractors are implemented
    },
  };
}

type General = FestivalActivityRepresentation["general"];
type Inquiry = FestivalActivityRepresentation["inquiry"];

function castGeneralSectionWithDate(
  general: HttpStringified<General>,
): General {
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

function castInquirySectionWithDate(
  inquiry: HttpStringified<Inquiry>,
): Inquiry {
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
