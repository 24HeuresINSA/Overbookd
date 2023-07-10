import { updateItemToList } from "../../utils/functions/list";
import { Gear } from "~/utils/models/catalog.model";

export interface Record {
  gear: Gear;
  quantity: number;
  storage: string;
}

export type LiteInventoryRecord = Omit<Record, "gear">;

export class InventoryRecord implements Record {
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
    const similarRecord = records.at(similarRecordIndex);
    if (!similarRecord) return [...records, this];
    const updatedRecord = this.add(similarRecord);
    return updateItemToList(records, similarRecordIndex, updatedRecord);
  }

  toJson(): Record {
    return { gear: this.gear, quantity: this.quantity, storage: this.storage };
  }

  toLiteRecord(): LiteInventoryRecord {
    return { quantity: this.quantity, storage: this.storage };
  }

  static isSimilar(
    currentRecord: InventoryRecord
  ): (value: InventoryRecord) => boolean {
    return (record) =>
      record.gear.slug === currentRecord.gear.slug &&
      record.storage === currentRecord.storage;
  }
}
