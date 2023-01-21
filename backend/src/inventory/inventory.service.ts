import { Inject } from '@nestjs/common';
import { Gear } from 'src/catalog/interfaces';
import { SlugifyService } from '../common/services/slugify.service';

export type LiteInventoryRecord = Omit<InventoryRecord, 'gear'>;

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

export interface GroupedRecordSearch {
  name?: string;
}

export interface InventoryRepository {
  searchGroupedRecords(gearSlug?: string): Promise<GroupedRecord[]>;
  resetRecords(records: InventoryRecord[]): Promise<GroupedRecord[]>;
  getRecords(gearId: number): Promise<InventoryRecord[]>;
}

export class InventoryService {
  constructor(
    @Inject('INVENTORY_REPOSITORY')
    private inventoryRepository: InventoryRepository,
    private slugifyService: SlugifyService,
  ) {}

  setup(records: InventoryRecord[]): Promise<GroupedRecord[]> {
    return this.inventoryRepository.resetRecords(records);
  }

  search({ name }: GroupedRecordSearch): Promise<GroupedRecord[]> {
    const gearSlug = this.slugifyService.slugify(name);
    return this.inventoryRepository.searchGroupedRecords(gearSlug);
  }

  getDetails(gearId: number): Promise<InventoryRecord[]> {
    return this.inventoryRepository.getRecords(gearId);
  }
}
