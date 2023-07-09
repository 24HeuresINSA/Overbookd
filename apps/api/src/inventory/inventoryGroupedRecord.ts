import { Gear } from 'src/catalog/interfaces';
import {
  GroupedRecord,
  InventoryRecord,
  LiteInventoryRecord,
  toLiteRecord,
} from './inventory.service';

export class InventoryGroupedRecord implements GroupedRecord {
  quantity: number;
  gear: Gear;
  records: LiteInventoryRecord[];

  constructor(quantity: number, gear: Gear, records: LiteInventoryRecord[]) {
    this.quantity = quantity;
    this.gear = gear;
    this.records = records;
  }

  static fromInventoryRecord(record: InventoryRecord) {
    const { quantity, gear } = record;
    return new InventoryGroupedRecord(quantity, gear, [toLiteRecord(record)]);
  }

  static isSimilar(
    record: GroupedRecord,
  ): (value: GroupedRecord, index: number, obj: GroupedRecord[]) => boolean {
    return (r) => r.gear.id === record.gear.id;
  }

  add({ quantity, records }: GroupedRecord) {
    const summedQuantities = this.quantity + quantity;
    return new InventoryGroupedRecord(summedQuantities, this.gear, [
      ...records,
      ...this.records,
    ]);
  }
}
