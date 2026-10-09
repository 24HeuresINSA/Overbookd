import { InventoryRepository } from "../inventory.service";
import { GroupInventoryRecord } from "../inventory-grouped-record";
import {
  InventoryGroupedRecord,
  InventoryRecord,
  InventoryRecordSearchOptions,
} from "@overbookd/http";
import { matchesInventorySearch } from "../inventory-record-search.builder";

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
        .filter((record) => matchesInventorySearch(record, options))
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
}
