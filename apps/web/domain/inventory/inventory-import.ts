import type { Gears } from "./gears";
import { InventoryRecord } from "./inventory-record";
import {
  ManualInventoryRecord,
  ManualInventoryRecordError,
} from "./manual-inventory-record";

export type InventoryImportRaw = {
  code: string;
  gear: string;
  quantity: number;
  storage: string;
  comment?: string;
};

export abstract class InventoryImportContainer {
  constructor(protected readonly gearRepository: Gears) {}
  abstract extractManualRecords(): Promise<ManualInventoryRecord[]>;
  protected convertImportRawsToManualRecords(
    raws: InventoryImportRaw[],
  ): ManualInventoryRecord[] {
    return raws.map(
      ({ code, gear, quantity, storage, comment }) =>
        new ManualInventoryRecord(
          this.gearRepository,
          code,
          gear,
          quantity,
          storage,
          comment,
        ),
    );
  }
}

export class InventoryImport {
  static async toRecords(file: InventoryImportContainer): Promise<{
    records: InventoryRecord[];
    errors: ManualInventoryRecordError[];
  }> {
    const manualRecords = await file.extractManualRecords();
    const inventoryRecords = await Promise.all(
      manualRecords.map(this.convertToRecords()),
    );

    const records = this.deduplicateRecords(
      inventoryRecords.filter(isInventoryRecord()),
    );
    const errors = inventoryRecords.filter(isRecordError());
    return { records, errors };
  }

  private static convertToRecords(): (
    value: ManualInventoryRecord,
  ) => Promise<InventoryRecord | ManualInventoryRecordError | undefined> {
    return async (manualRecord) => {
      try {
        return await manualRecord.toInventoryRecord();
      } catch (e) {
        if (e instanceof ManualInventoryRecordError) return e;
        return undefined;
      }
    };
  }

  private static deduplicateRecords(
    inventoryRecords: InventoryRecord[],
  ): InventoryRecord[] {
    return inventoryRecords.reduce<InventoryRecord[]>(
      (records, currentRecord) => currentRecord.mergeInside(records),
      [],
    );
  }
}

function isRecordError(): (
  value: InventoryRecord | ManualInventoryRecordError | undefined,
) => value is ManualInventoryRecordError {
  return (error): error is ManualInventoryRecordError =>
    (error as ManualInventoryRecordError)?.message !== undefined;
}

function isInventoryRecord(): (
  value: InventoryRecord | ManualInventoryRecordError | undefined,
) => value is InventoryRecord {
  return (record): record is InventoryRecord =>
    (record as InventoryRecord)?.gear?.name !== undefined;
}
