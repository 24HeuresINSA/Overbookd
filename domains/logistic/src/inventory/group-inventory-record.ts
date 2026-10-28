import { CatalogGear } from "../catalog/gear/gear.js";
import {
  InventoryGroupedRecord,
  InventoryRecord,
  InventoryRecordSearchOptions,
  LiteInventoryRecord,
  toLiteRecord,
} from "./inventory.js";
import { matchesInventorySearch } from "./inventory-search.builder.js";

export class GroupInventoryRecord implements InventoryGroupedRecord {
  constructor(
    public quantity: number,
    public gear: CatalogGear,
    public records: LiteInventoryRecord[],
  ) {}

  static fromInventoryRecord(record: InventoryRecord): GroupInventoryRecord {
    const { quantity, gear } = record;
    return new GroupInventoryRecord(quantity, gear, [toLiteRecord(record)]);
  }

  static isSimilar(
    record: InventoryGroupedRecord,
  ): (
    value: InventoryGroupedRecord,
    index: number,
    obj: InventoryGroupedRecord[],
  ) => boolean {
    return (r) => r.gear.id === record.gear.id;
  }

  add({ quantity, records }: InventoryGroupedRecord): GroupInventoryRecord {
    const summedQuantities = this.quantity + quantity;
    return new GroupInventoryRecord(summedQuantities, this.gear, [
      ...records,
      ...this.records,
    ]);
  }
}

export function groupInventoryRecords(
  records: InventoryRecord[],
  options: InventoryRecordSearchOptions = {},
): InventoryGroupedRecord[] {
  return records
    .filter((record) => matchesInventorySearch(record, options))
    .reduce<InventoryGroupedRecord[]>((groupedRecords, record) => {
      const groupedRecord = GroupInventoryRecord.fromInventoryRecord(record);
      const similarRecordIndex = groupedRecords.findIndex(
        GroupInventoryRecord.isSimilar(groupedRecord),
      );
      if (similarRecordIndex === -1) {
        return [...groupedRecords, groupedRecord];
      }
      const existingRecord = groupedRecords.at(similarRecordIndex)!;
      const mergedRecord = groupedRecord.add(existingRecord);
      return [
        ...groupedRecords.slice(0, similarRecordIndex),
        mergedRecord,
        ...groupedRecords.slice(similarRecordIndex + 1),
      ];
    }, []);
}
