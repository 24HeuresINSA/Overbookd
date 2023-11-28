import { IProvidePeriod } from "@overbookd/period";

export type TimeWindow = IProvidePeriod & {
  id: string;
};
