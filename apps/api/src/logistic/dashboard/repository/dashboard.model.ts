import { FestivalActivity } from "@overbookd/festival-event";
import { IProvidePeriod } from "@overbookd/time";

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

export type DatabaseBorrow = {
  quantity: number;
  borrow: {
    id: number;
    lender: string;
    availableOn: Date;
    unavailableOn: Date;
  };
};

export type DatabasePurchase = {
  quantity: number;
  purchase: {
    id: number;
    seller: string;
    availableOn: Date;
  };
};

type WithDatabaseBorrows = {
  borrows: DatabaseBorrow[];
};

type WithDatabasePurchases = {
  purchases: DatabasePurchase[];
};

export type DatabaseDashboardGear = BaseDatabaseGear &
  WithDatabaseInventory &
  WithDatabaseInquiries &
  WithDatabaseBorrows &
  WithDatabasePurchases;
