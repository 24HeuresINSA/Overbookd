import { Inject } from "@nestjs/common";
import { SlugifyService } from "@overbookd/slugify";
import {
  InventoryGroupedRecord,
  InventoryRecord,
  LiteInventoryRecord,
} from "@overbookd/http";

export function toLiteRecord(record: InventoryRecord): LiteInventoryRecord {
  return { quantity: record.quantity, storage: record.storage };
}

export type GroupedRecordSearch = {
  name?: string;
};

export type InventoryRepository = {
  searchGroupedRecords(gearSlug?: string): Promise<InventoryGroupedRecord[]>;
  resetRecords(records: InventoryRecord[]): Promise<InventoryGroupedRecord[]>;
  getRecords(gearId: number): Promise<InventoryRecord[]>;
};

export class InventoryService {
  constructor(
    @Inject("INVENTORY_REPOSITORY")
    private inventoryRepository: InventoryRepository,
  ) {}

  setup(records: InventoryRecord[]): Promise<InventoryGroupedRecord[]> {
    return this.inventoryRepository.resetRecords(records);
  }

  search({ name }: GroupedRecordSearch): Promise<InventoryGroupedRecord[]> {
    const gearSlug = SlugifyService.applyOnOptional(name);
    return this.inventoryRepository.searchGroupedRecords(gearSlug);
  }

  getDetails(gearId: number): Promise<InventoryRecord[]> {
    return this.inventoryRepository.getRecords(gearId);
  }
}
