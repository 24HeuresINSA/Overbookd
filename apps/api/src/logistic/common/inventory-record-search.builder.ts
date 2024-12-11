import { SlugifyService } from "@overbookd/slugify";
import { InventoryRecord } from "@overbookd/http";
import { GearSearchBuilder } from "./gear-search.builder";

export class InventoryRecordSearchBuilder {
  private storageCondition = true;
  private record: InventoryRecord;
  private gearSearchBuilder: GearSearchBuilder;

  constructor(record: InventoryRecord) {
    this.record = record;
    this.gearSearchBuilder = new GearSearchBuilder(record.gear);
  }

  addOwnerCondition(ownerSearch?: string) {
    this.gearSearchBuilder.addOwnerCondition(ownerSearch);
    return this;
  }

  addSlugCondition(slugSearch?: string) {
    this.gearSearchBuilder.addSlugCondition(slugSearch);
    return this;
  }

  addCategoryCondition(categorySearch?: string) {
    this.gearSearchBuilder.addCategoryCondition(categorySearch);
    return this;
  }

  addPonctualUsageCondition(ponctualUsage?: boolean) {
    this.gearSearchBuilder.addPonctualUsageCondition(ponctualUsage);
    return this;
  }

  addStorageCondition(storageSearch?: string) {
    const slugifiedStorage = SlugifyService.apply(this.record.storage);
    this.storageCondition = storageSearch
      ? slugifiedStorage.includes(storageSearch) ||
        storageSearch.includes(slugifiedStorage)
      : true;
    return this;
  }

  get match(): boolean {
    return this.gearSearchBuilder.match && this.storageCondition;
  }
}
