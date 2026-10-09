import { Injectable } from "@nestjs/common";
import {
  InventoryGroupedRecord,
  InventoryRecord,
  InventoryRecordSearchOptions,
} from "@overbookd/http";
import { InventoryManager } from "@overbookd/logistic";

@Injectable()
export class InventoryService {
  constructor(private readonly inventory: InventoryManager) {}

  setup(records: InventoryRecord[]): Promise<InventoryGroupedRecord[]> {
    return this.inventory.setup(records);
  }

  search(
    searchOptions: InventoryRecordSearchOptions,
  ): Promise<InventoryGroupedRecord[]> {
    return this.inventory.search(searchOptions);
  }

  getDetails(gearId: number): Promise<InventoryRecord[]> {
    return this.inventory.getDetails(gearId);
  }

  getStoragesHavingGear(): Promise<string[]> {
    return this.inventory.getStoragesHavingGear();
  }
}
