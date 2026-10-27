import { SlugifyService } from "@overbookd/slugify";
import { GearSearchBuilder } from "../catalog/gear/gear-search.builder.js";
import { InventoryRecord, InventoryRecordSearchOptions } from "./inventory.js";

class InventoryRecordSearchBuilder {
  private storageCondition = true;

  private readonly gearSearchBuilder: GearSearchBuilder;

  constructor(private readonly record: InventoryRecord) {
    this.gearSearchBuilder = new GearSearchBuilder(record.gear);
  }

  addOwnerCondition(ownerSearch?: string): this {
    this.gearSearchBuilder.addOwnerCondition(ownerSearch);
    return this;
  }

  addSlugCondition(slugSearch?: string): this {
    this.gearSearchBuilder.addSlugCondition(slugSearch);
    return this;
  }

  addCategoryCondition(categorySearch?: string): this {
    this.gearSearchBuilder.addCategoryCondition(categorySearch);
    return this;
  }

  addPonctualUsageCondition(ponctualUsage?: boolean): this {
    this.gearSearchBuilder.addPonctualUsageCondition(ponctualUsage);
    return this;
  }

  addStorageCondition(storageSearch?: string): this {
    const slugifiedStorage = SlugifyService.apply(this.record.storage);
    if (!storageSearch) {
      this.storageCondition = true;
      return this;
    }
    this.storageCondition =
      slugifiedStorage.includes(storageSearch) ||
      storageSearch.includes(slugifiedStorage);
    return this;
  }

  get match(): boolean {
    return this.gearSearchBuilder.match && this.storageCondition;
  }
}

export function matchesInventorySearch(
  record: InventoryRecord,
  options: InventoryRecordSearchOptions,
): boolean {
  const slug = SlugifyService.applyOnOptional(options.search);
  const category = SlugifyService.applyOnOptional(options.category);
  const owner = SlugifyService.applyOnOptional(options.owner);
  const storage = SlugifyService.applyOnOptional(options.storage);

  return new InventoryRecordSearchBuilder(record)
    .addCategoryCondition(category)
    .addSlugCondition(slug)
    .addOwnerCondition(owner)
    .addPonctualUsageCondition(options.ponctualUsage)
    .addStorageCondition(storage).match;
}
