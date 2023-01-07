import { GearRepository } from "./gear.repository";
import { InventoryRecord } from "./inventory-record";
import {
  ManualInventoryRecord,
  ManualInventoryRecordError,
} from "./manual-inventory-record";

export abstract class InventoryImportContainer {
  constructor(protected readonly gearRepository: GearRepository) {}
  abstract extractManualRecords(): Promise<ManualInventoryRecord[]>;
}

export class InventoryImport {
  static async toRecords(file: InventoryImportContainer): Promise<{
    records: InventoryRecord[];
    errors: ManualInventoryRecordError[];
  }> {
    const manualRecords = await file.extractManualRecords();
    const inventoryRecords = await Promise.all(
      manualRecords.map(this.convertToRecords())
    );

    const records = this.deduplicateRecords(
      inventoryRecords.filter(isInventoryRecord())
    );
    const errors = inventoryRecords.filter(isRecordError());
    return { records, errors };
  }

  private static convertToRecords(): (
    value: ManualInventoryRecord
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
    inventoryRecords: InventoryRecord[]
  ): InventoryRecord[] {
    return inventoryRecords.reduce<InventoryRecord[]>(
      (records, currentRecord) => {
        const similarRecordIndex = records.findIndex(
          isSimilarRecord(currentRecord)
        );
        if (similarRecordIndex === -1) return [...records, currentRecord];
        const similarRecord = records[similarRecordIndex];
        const updatedRecord = this.mergeRecords(similarRecord, currentRecord);
        return updateItemToList(records, similarRecordIndex, updatedRecord);
      },
      []
    );
  }

  private static mergeRecords(
    previousRecord: InventoryRecord,
    currentRecord: InventoryRecord
  ) {
    const quantity = currentRecord.quantity + previousRecord.quantity;
    const updatedRecord = new InventoryRecord(
      currentRecord.gear,
      quantity,
      currentRecord.storage
    );
    return updatedRecord;
  }
}

function isRecordError(): (
  value: InventoryRecord | ManualInventoryRecordError | undefined
) => value is ManualInventoryRecordError {
  return (error): error is ManualInventoryRecordError =>
    (error as ManualInventoryRecordError)?.message !== undefined;
}

function isInventoryRecord(): (
  value: InventoryRecord | ManualInventoryRecordError | undefined
) => value is InventoryRecord {
  return (record): record is InventoryRecord =>
    (record as InventoryRecord)?.gear?.name !== undefined;
}

function updateItemToList<T>(list: T[], index: number, newValue: T): T[] {
  return [...list.slice(0, index), newValue, ...list.slice(index + 1)];
}

function isSimilarRecord(
  currentRecord: InventoryRecord
): (value: InventoryRecord) => boolean {
  return (record) =>
    record.gear.slug === currentRecord.gear.slug &&
    record.storage === currentRecord.storage;
}
