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

type DatabaseTask = {
  id: FestivalActivity["id"];
  name: FestivalActivity["general"]["name"];
  mobilizations: IProvidePeriod[];
};

export type DatabaseActivityInquiry = {
  quantity: number;
  fa: DatabaseActivity;
};

export type DatabaseTaskInquiry = {
  quantity: number;
  ft: DatabaseTask;
};

type WithDatabaseInquiries = {
  festivalActivityInquiries: DatabaseActivityInquiry[];
  festivalTaskInquiries: DatabaseTaskInquiry[];
};

export type DatabaseGear = BaseDatabaseGear &
  WithDatabaseInventory &
  WithDatabaseInquiries;
