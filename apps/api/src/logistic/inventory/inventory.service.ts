import { Inject } from "@nestjs/common";
import { Gear } from "../catalog/interfaces";
import { SlugifyService } from "@overbookd/slugify";

export type LiteInventoryRecord = Omit<InventoryRecord, "gear">;

export type GroupedRecord = {
  quantity: number;
  gear: Gear;
  records: LiteInventoryRecord[];
};

export type InventoryRecord = {
  quantity: number;
  gear: Gear;
  storage: string;
};

export function toLiteRecord(record: InventoryRecord): LiteInventoryRecord {
  return { quantity: record.quantity, storage: record.storage };
}

export type GroupedRecordSearch = {
  name?: string;
};

export type InventoryRepository = {
  searchGroupedRecords(gearSlug?: string): Promise<GroupedRecord[]>;
  resetRecords(records: InventoryRecord[]): Promise<GroupedRecord[]>;
  getRecords(gearId: number): Promise<InventoryRecord[]>;
};

export class InventoryService {
  constructor(
    @Inject("INVENTORY_REPOSITORY")
    private inventoryRepository: InventoryRepository,
  ) {}

  setup(records: InventoryRecord[]): Promise<GroupedRecord[]> {
    return this.inventoryRepository.resetRecords(records);
  }

  search({ name }: GroupedRecordSearch): Promise<GroupedRecord[]> {
    const gearSlug = SlugifyService.applyOnOptional(name);
    return this.inventoryRepository.searchGroupedRecords(gearSlug);
  }

  getDetails(gearId: number): Promise<InventoryRecord[]> {
    return this.inventoryRepository.getRecords(gearId);
  }
}
