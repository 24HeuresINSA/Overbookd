import { CatalogGear } from "./gear.js";

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
