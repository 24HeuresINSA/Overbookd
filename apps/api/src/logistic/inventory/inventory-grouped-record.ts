import {
  CatalogGear,
  InventoryGroupedRecord,
  InventoryRecord,
  LiteInventoryRecord,
} from "@overbookd/http";
import { toLiteRecord } from "./inventory.service";

export class GroupInventoryRecord implements InventoryGroupedRecord {
  quantity: number;
  gear: CatalogGear;
  records: LiteInventoryRecord[];

  constructor(
    quantity: number,
    gear: CatalogGear,
    records: LiteInventoryRecord[],
  ) {
    this.quantity = quantity;
    this.gear = gear;
    this.records = records;
  }

  static fromInventoryRecord(record: InventoryRecord) {
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

  add({ quantity, records }: InventoryGroupedRecord) {
    const summedQuantities = this.quantity + quantity;
    return new GroupInventoryRecord(summedQuantities, this.gear, [
      ...records,
      ...this.records,
    ]);
  }
}
