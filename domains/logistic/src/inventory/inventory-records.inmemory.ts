import { InventoryRecord } from "./inventory.js";
import { InventoryRecords } from "./inventory-manager.js";

export class InMemoryInventoryRecords implements InventoryRecords {
  private records: InventoryRecord[];

  constructor(records: InventoryRecord[] = []) {
    this.records = records;
  }

  findAll(): Promise<InventoryRecord[]> {
    return Promise.resolve(this.records);
  }

  findByGearId(gearId: number): Promise<InventoryRecord[]> {
    return Promise.resolve(
      this.records.filter((record) => record.gear.id === gearId),
    );
  }

  replaceAll(records: InventoryRecord[]): Promise<void> {
    this.records = records;
    return Promise.resolve();
  }

  getStorages(): Promise<string[]> {
    return Promise.resolve([
      ...new Set(this.records.map((record) => record.storage)),
    ]);
  }

  get savedRecords(): InventoryRecord[] {
    return this.records;
  }
}
