import { Gear } from "~/utils/models/catalog.model";
import { GearRepository } from "./gear.repository";
import { InventoryRecord } from "./inventory-record";

export class ManualInventoryRecord {
  constructor(
    public readonly gear: string,
    public readonly quantity: number,
    public readonly storage: string,
    private readonly gearRepository: GearRepository
  ) {}

  async toInventoryRecord(): Promise<InventoryRecord> {
    const gear = await this.findGear();
    if (!gear) throw new ManualInventoryRecordError(this);
    return new InventoryRecord(gear, this.quantity, this.storage);
  }

  private findGear(): Promise<Gear | undefined> {
    return this.gearRepository.find(this.gear);
  }
}

export class ManualInventoryRecordError extends Error {
  constructor(public readonly record: ManualInventoryRecord) {
    super(`Gear ${record.gear} doesn't exist`);
  }
}

export class DisplayableManualInventoryRecordError {
  constructor(public readonly record: ManualInventoryRecord) {}

  static fromError(
    error: ManualInventoryRecordError
  ): DisplayableManualInventoryRecordError {
    return new DisplayableManualInventoryRecordError(error.record);
  }

  toInventoryRecord(gear: Gear) {
    return new InventoryRecord(gear, this.record.quantity, this.record.storage);
  }
}
