import { InventoryRecord } from "@overbookd/http";
import { IProvidePeriod } from "@overbookd/period";

type BaseDatabaseGear = {
  id: number;
  name: string;
  slug: string;
  isConsumable: boolean;
};

type WithDatabaseInventory = {
  inventoryRecords: InventoryRecord[];
};

export type DatabaseInquiry = {
  quantity: number;
  fa: { inquiryTimeWindows: IProvidePeriod[] };
};

type WithDatabaseInquiries = {
  inquiries: DatabaseInquiry[];
};

export type DatabaseGear = BaseDatabaseGear &
  WithDatabaseInventory &
  WithDatabaseInquiries;
