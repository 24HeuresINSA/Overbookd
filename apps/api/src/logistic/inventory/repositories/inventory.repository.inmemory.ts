import { InventoryRepository } from "../inventory.service";
import { GroupInventoryRecord } from "../inventory-grouped-record";
import {
  InventoryGroupedRecord,
  InventoryRecord,
  InventoryRecordSearchOptions,
} from "@overbookd/http";
import { SlugifyService } from "@overbookd/slugify";
import { InventoryRecordSearchBuilder } from "../../common/inventory-record-search.builder";

export class InMemoryInventoryRepository implements InventoryRepository {
  private records: InventoryRecord[];

  constructor(records?: InventoryRecord[]) {
    this.records = records ?? [];
  }

  resetRecords(records: InventoryRecord[]): Promise<InventoryGroupedRecord[]> {
    this.records = records;
    return this.searchGroupedRecords();
  }

  searchGroupedRecords(
    options: InventoryRecordSearchOptions = {},
  ): Promise<InventoryGroupedRecord[]> {
    return Promise.resolve(
      this.records
        .filter((record) => this.isMatchingSearch(options, record))
        .reduce((groupedRecords, record) => {
          const groupedRecord =
            GroupInventoryRecord.fromInventoryRecord(record);
          const similarRecordIndex = groupedRecords.findIndex(
            GroupInventoryRecord.isSimilar(groupedRecord),
          );
          if (similarRecordIndex === -1)
            return [...groupedRecords, groupedRecord];
          const existingRecord = groupedRecords.at(similarRecordIndex);
          const mergedRecord = groupedRecord.add(existingRecord);
          return [
            ...groupedRecords.slice(0, similarRecordIndex),
            mergedRecord,
            ...groupedRecords.slice(similarRecordIndex + 1),
          ];
        }, []),
    );
  }

  getRecords(gearId: number): Promise<InventoryRecord[]> {
    return Promise.resolve(
      this.records.filter((record) => record.gear.id === gearId),
    );
  }

  getStoragesHavingGear(): Promise<string[]> {
    return Promise.resolve([
      ...new Set(this.records.map((record) => record.storage)),
    ]);
  }

  private isMatchingSearch(
    {
      category,
      search,
      owner,
      ponctualUsage,
      storage,
    }: InventoryRecordSearchOptions,
    record: InventoryRecord,
  ): boolean {
    const slug = SlugifyService.applyOnOptional(search);
    const categorySlug = SlugifyService.applyOnOptional(category);
    const ownerSlug = SlugifyService.applyOnOptional(owner);
    const storageSlug = SlugifyService.applyOnOptional(storage);

    const gearSearch = new InventoryRecordSearchBuilder(record)
      .addCategoryCondition(categorySlug)
      .addSlugCondition(slug)
      .addOwnerCondition(ownerSlug)
      .addPonctualUsageCondition(ponctualUsage)
      .addStorageCondition(storageSlug);
    return gearSearch.match;
  }
}
