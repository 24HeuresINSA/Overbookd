import { CatalogGear, GearSearchOptions } from "../catalog/gear/gear.js";

export type InventoryRecordSearchOptions = GearSearchOptions & {
  storage?: string;
};

export type InventoryRecord = {
  gear: CatalogGear;
  quantity: number;
  storage: string;
  comment?: string;
};

export type LiteInventoryRecord = Omit<InventoryRecord, "gear">;

export type InventoryGroupedRecord = {
  gear: CatalogGear;
  quantity: number;
  records: LiteInventoryRecord[];
};

export function toLiteRecord(record: InventoryRecord): LiteInventoryRecord {
  const { gear: _, ...liteRecord } = record;
  return liteRecord;
}
