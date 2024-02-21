import { WithAtLeastOneItem } from "@overbookd/list";
import { InquiryRequest } from "../../common/inquiry-request";
import { TimeWindow } from "../../common/time-window";

export const MATOS = "matos";
export const BARRIERES = "barrieres";
export const ELEC = "elec";

export type InquiryOwner = typeof MATOS | typeof BARRIERES | typeof ELEC;

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
