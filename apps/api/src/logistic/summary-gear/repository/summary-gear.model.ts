import { IProvidePeriod } from "@overbookd/period";

export type InventoryRecord = {
  quantity: number;
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

type BaseDatabaseGear = {
  id: number;
  name: string;
  slug: string;
  isConsumable: boolean;
};

export type DatabaseGear = BaseDatabaseGear &
  WithDatabaseInventory &
  WithDatabaseInquiries;
