import {
  InventoryGroupedRecord,
  InventoryRecord,
  InventoryRecordSearchOptions,
} from "./inventory.js";
import { groupInventoryRecords } from "./group-inventory-record.js";

export type InventoryRecords = {
  findAll(): Promise<InventoryRecord[]>;
  findByGearId(gearId: number): Promise<InventoryRecord[]>;
  replaceAll(records: InventoryRecord[]): Promise<void>;
  getStorages(): Promise<string[]>;
};

export class InventoryManager {
  constructor(private readonly records: InventoryRecords) {}

  async setup(records: InventoryRecord[]): Promise<InventoryGroupedRecord[]> {
    await this.records.replaceAll(records);
    return this.search();
  }

  async search(
    options: InventoryRecordSearchOptions = {},
  ): Promise<InventoryGroupedRecord[]> {
    const records = await this.records.findAll();
    return groupInventoryRecords(records, options);
  }

  getDetails(gearId: number): Promise<InventoryRecord[]> {
    return this.records.findByGearId(gearId);
  }

  getStoragesHavingGear(): Promise<string[]> {
    return this.records.getStorages();
  }
}
