import { CatalogGear, GearSearchOptions } from "./gear.js";

export type InventoryRecordSearchOptions = GearSearchOptions & {
  storage?: string;
};

export type InventoryRecord = {
  gear: CatalogGear;
  quantity: number;
  storage: string;
};

export type LiteInventoryRecord = Omit<InventoryRecord, "gear">;

export type InventoryGroupedRecord = {
  gear: CatalogGear;
  quantity: number;
  records: LiteInventoryRecord[];
};
