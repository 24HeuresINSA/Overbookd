import type { CatalogGear } from "@overbookd/http";
import type { Gears } from "./gears";
import { InventoryRecord } from "./inventory-record";

export class ManualInventoryRecord {
  constructor(
    public readonly code: string,
    public readonly gear: string,
    public readonly quantity: number,
    public readonly storage: string,
    private readonly gearRepository: Gears,
  ) {}

  async toInventoryRecord(): Promise<InventoryRecord> {
    const gear = await this.findGear();
    if (!gear) throw new ManualInventoryRecordError(this);
    return new InventoryRecord(gear, this.quantity, this.storage);
  }

  private findGear(): Promise<CatalogGear | undefined> {
    return this.gearRepository.find(this.code);
  }
}

export class ManualInventoryRecordError extends Error {
  constructor(public readonly record: ManualInventoryRecord) {
    super(`Gear ${record.gear} (${record.code}) doesn't exist`);
  }
}

export class DisplayableManualInventoryRecordError {
  constructor(
    public readonly record: ManualInventoryRecord,
    public readonly error: string,
  ) {}

  static fromError(
    error: ManualInventoryRecordError,
  ): DisplayableManualInventoryRecordError {
    return new DisplayableManualInventoryRecordError(
      error.record,
      error.message,
    );
  }

  toInventoryRecord(gear: CatalogGear) {
    return new InventoryRecord(gear, this.record.quantity, this.record.storage);
  }
}
