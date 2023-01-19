import { Gear } from 'src/catalog/interfaces';
import { SlugifyService } from 'src/common/services/slugify.service';

export type GroupedRecord = {
  quantity: number;
  gear: Gear;
};

export type InventoryRecord = {
  quantity: number;
  gear: Gear;
  storage: string;
};

export interface InventoryRepository {
  searchRecords(gearSlug?: string): Promise<GroupedRecord[]>;
  resetRecords(records: InventoryRecord[]): Promise<GroupedRecord[]>;
}

export class InventoryService {
  constructor(
    private inventoryRepository: InventoryRepository,
    private slugifyService: SlugifyService,
  ) {}

  setup(records: InventoryRecord[]): Promise<GroupedRecord[]> {
    return this.inventoryRepository.resetRecords(records);
  }

  search(gearName?: string): Promise<GroupedRecord[]> {
    const slug = this.slugifyService.slugify(gearName);
    return this.inventoryRepository.searchRecords(slug);
  }
}
