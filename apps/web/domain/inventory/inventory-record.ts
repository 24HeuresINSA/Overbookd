import type {
  CatalogGear,
  LiteInventoryRecord,
  InventoryRecord as Record,
} from "@overbookd/http";
import { updateItemToList } from "@overbookd/list";

export class InventoryRecord implements Record {
  constructor(
    public readonly gear: CatalogGear,
    public readonly quantity: number,
    public readonly storage: string,
    public readonly comment?: string,
  ) {}

  private add(newRecord: InventoryRecord) {
    const quantity = newRecord.quantity + this.quantity;
    const bothRecordsHaveComment = !!this.comment && !!newRecord.comment;
    const comment = bothRecordsHaveComment
      ? `${this.comment} | ${newRecord.comment}`
      : this.comment || newRecord.comment;
    const updatedRecord = new InventoryRecord(
      this.gear,
      quantity,
      this.storage,
      comment,
    );
    return updatedRecord;
  }

  mergeInside(records: InventoryRecord[]): InventoryRecord[] {
    const similarRecordIndex = records.findIndex(
      InventoryRecord.isSimilar(this),
    );
    if (similarRecordIndex === -1) return [...records, this];
    const similarRecord = records.at(similarRecordIndex);
    if (!similarRecord) return [...records, this];
    const updatedRecord = this.add(similarRecord);
    return updateItemToList(records, similarRecordIndex, updatedRecord);
  }

  toJson(): Record {
    return {
      gear: this.gear,
      quantity: this.quantity,
      storage: this.storage,
      comment: this.comment,
    };
  }

  toLiteRecord(): LiteInventoryRecord {
    return {
      quantity: this.quantity,
      storage: this.storage,
      comment: this.comment,
    };
  }

  static isSimilar(
    currentRecord: InventoryRecord,
  ): (value: InventoryRecord) => boolean {
    return (record) =>
      (record.gear.code === currentRecord.gear.code ||
        record.gear.slug === currentRecord.gear.slug) &&
      record.storage === currentRecord.storage;
  }
}
