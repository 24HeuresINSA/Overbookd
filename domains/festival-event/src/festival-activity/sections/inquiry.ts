import { WithAtLeastOneItem } from "@overbookd/list";
import { InquiryRequest } from "../../common/inquiry-request.js";
import { TimeWindow } from "../../common/time-window.js";
import { BARRIERES, LOG_ELEC, LOG_MATOS } from "@overbookd/team-constants";

export type InquiryOwner =
  | typeof LOG_MATOS
  | typeof BARRIERES
  | typeof LOG_ELEC;

export type WithTimeWindows = {
  timeWindows: WithAtLeastOneItem<TimeWindow>;
};

type WithGearInquiries = {
  barriers: InquiryRequest[];
  electricity: InquiryRequest[];
  gears: WithAtLeastOneItem<InquiryRequest>;
};

type WithBarrierInquiries = {
  barriers: WithAtLeastOneItem<InquiryRequest>;
  electricity: InquiryRequest[];
  gears: InquiryRequest[];
};

type WithElectricityInquiries = {
  barriers: InquiryRequest[];
  electricity: WithAtLeastOneItem<InquiryRequest>;
  gears: InquiryRequest[];
};

export type WithInquiries =
  | WithGearInquiries
  | WithBarrierInquiries
  | WithElectricityInquiries;

export type InquiryWithRequests = WithInquiries & WithTimeWindows;

export type InquiryWithPotentialRequests = {
  timeWindows: TimeWindow[];
  gears: InquiryRequest[];
  electricity: InquiryRequest[];
  barriers: InquiryRequest[];
};

export type Inquiry = InquiryWithPotentialRequests | InquiryWithRequests;
