import { SummaryGearPreview } from "@overbookd/http";
import { IProvidePeriod } from "@overbookd/period";

type WithDatabaseInventory = {
  inventoryRecords: { quantity: number }[];
};

type DatabaseInquiry = {
  quantity: number;
  fa: { inquiryTimeWindows: IProvidePeriod[] };
};

type WithDatabaseInquiries = {
  inquiries: DatabaseInquiry[];
};

export type DatabaseGearPreview = Omit<SummaryGearPreview, "minDelta"> &
  WithDatabaseInventory &
  WithDatabaseInquiries;
