import {
  GroupedRecord,
  InventoryRecord,
  InventoryRepository,
} from '../inventory.service';
import { InventoryGroupedRecord } from '../inventoryGroupedRecord';

export class InMemoryInventoryRepository implements InventoryRepository {
  private records: InventoryRecord[];

  constructor(records?: InventoryRecord[]) {
    this.records = records ?? [];
  }

  resetRecords(records: InventoryRecord[]): Promise<GroupedRecord[]> {
    this.records = records;
    return this.searchGroupedRecords();
  }

  searchGroupedRecords(gearSlug?: string): Promise<GroupedRecord[]> {
    return Promise.resolve(
      this.records
        .filter((record) => record.gear.slug.includes(gearSlug ?? ''))
        .reduce((groupedRecords, record) => {
          const groupedRecord =
            InventoryGroupedRecord.fromInventoryRecord(record);
          const similarRecordIndex = groupedRecords.findIndex(
            InventoryGroupedRecord.isSimilar(groupedRecord),
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
        }, [] as GroupedRecord[]),
    );
  }

  getRecords(gearId: number): Promise<InventoryRecord[]> {
    return Promise.resolve(
      this.records.filter((record) => record.gear.id === gearId),
    );
  }
}
