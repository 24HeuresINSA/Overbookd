import { updateItemToList } from "../../utils/functions/list";
import { Gear } from "~/utils/models/catalog.model";

export class InventoryRecord {
  constructor(
    public readonly gear: Gear,
    public readonly quantity: number,
    public readonly storage: string
  ) {}

  private add(newRecord: InventoryRecord) {
    const quantity = newRecord.quantity + this.quantity;
    const updatedRecord = new InventoryRecord(
      this.gear,
      quantity,
      this.storage
    );
    return updatedRecord;
  }

  mergeInside(records: InventoryRecord[]): InventoryRecord[] {
    const similarRecordIndex = records.findIndex(
      InventoryRecord.isSimilar(this)
    );
    if (similarRecordIndex === -1) return [...records, this];
    const similarRecord = records[similarRecordIndex];
    const updatedRecord = this.add(similarRecord);
    return updateItemToList(records, similarRecordIndex, updatedRecord);
  }

  static isSimilar(
    currentRecord: InventoryRecord
  ): (value: InventoryRecord) => boolean {
    return (record) =>
      record.gear.slug === currentRecord.gear.slug &&
      record.storage === currentRecord.storage;
  }
}
