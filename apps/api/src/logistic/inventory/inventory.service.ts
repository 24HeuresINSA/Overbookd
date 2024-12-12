import { Inject } from "@nestjs/common";
import {
  InventoryGroupedRecord,
  InventoryRecord,
  InventoryRecordSearchOptions,
  LiteInventoryRecord,
} from "@overbookd/http";

export function toLiteRecord(record: InventoryRecord): LiteInventoryRecord {
  return { quantity: record.quantity, storage: record.storage };
}

export type InventoryRepository = {
  searchGroupedRecords(
    searchOptions: InventoryRecordSearchOptions,
  ): Promise<InventoryGroupedRecord[]>;
  resetRecords(records: InventoryRecord[]): Promise<InventoryGroupedRecord[]>;
  getRecords(gearId: number): Promise<InventoryRecord[]>;
  getStoragesHavingGear(): Promise<string[]>;
};

export class InventoryService {
  constructor(
    @Inject("INVENTORY_REPOSITORY")
    private inventoryRepository: InventoryRepository,
  ) {}

  setup(records: InventoryRecord[]): Promise<InventoryGroupedRecord[]> {
    return this.inventoryRepository.resetRecords(records);
  }

  search(
    searchOptions: InventoryRecordSearchOptions,
  ): Promise<InventoryGroupedRecord[]> {
    return this.inventoryRepository.searchGroupedRecords(searchOptions);
  }

  getDetails(gearId: number): Promise<InventoryRecord[]> {
    return this.inventoryRepository.getRecords(gearId);
  }

  getStoragesHavingGear(): Promise<string[]> {
    return this.inventoryRepository.getStoragesHavingGear();
  }
}
