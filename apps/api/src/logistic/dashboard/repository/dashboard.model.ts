import { FestivalActivity } from "@overbookd/festival-event";
import { IProvidePeriod } from "@overbookd/period";

type BaseDatabaseGear = {
  id: number;
  name: string;
  slug: string;
  isConsumable: boolean;
};

export type InventoryRecord = {
  quantity: number;
};

type WithDatabaseInventory = {
  inventoryRecords: InventoryRecord[];
};

type DatabaseActivity = {
  id: FestivalActivity["id"];
  name: FestivalActivity["general"]["name"];
  inquiryTimeWindows: IProvidePeriod[];
};

export type DatabaseInquiry = {
  quantity: number;
  fa: DatabaseActivity;
};

type WithDatabaseInquiries = {
  festivalActivityInquiries: DatabaseInquiry[];
};

export type DatabaseGear = BaseDatabaseGear &
  WithDatabaseInventory &
  WithDatabaseInquiries;
