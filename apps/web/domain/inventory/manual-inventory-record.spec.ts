import { describe, beforeAll, expect, it } from "vitest";
import { InMemoryGears } from "./gears.inmemory";
import { InventoryRecord } from "./inventory-record";
import {
  DisplayableManualInventoryRecordError,
  ManualInventoryRecord,
  ManualInventoryRecordError,
} from "./manual-inventory-record";
import { marteau, perceuse, scieCirculaire } from "./test-helper";
import type { CatalogGear } from "@overbookd/http";

describe("Inventory Fill Form", () => {
  describe("When using a manual record with existing gear", () => {
    describe.each`
      gear              | quantity | storage
      ${marteau}        | ${13}    | ${"Cave du E"}
      ${perceuse}       | ${2}     | ${"Local"}
      ${scieCirculaire} | ${1}     | ${"Conteneur du H"}
    `(
      "When recording $quantity $gear.name in $storage",
      ({ gear, quantity, storage }) => {
        let record: InventoryRecord;
        beforeAll(async () => {
          const gears = [marteau, perceuse, scieCirculaire];
          const gearRepository = new InMemoryGears(gears);
          const manualRecord = new ManualInventoryRecord(
            gearRepository,
            (gear as CatalogGear).code ?? "",
            (gear as CatalogGear).name,
            quantity as number,
            storage as string,
          );
          record = await manualRecord.toInventoryRecord();
        });
        it("should set up quantity", () => {
          expect(record.quantity).toBe(quantity);
        });
        it("should set up gear", () => {
          expect(record.gear).toBe(gear);
        });
        it("should set up storage location", () => {
          expect(record.storage).toBe(storage);
        });
      },
    );
  });
  describe("When using a manual record with unexisting gear", () => {
    const inexistingGearCode = "BR_OU_420";
    const inexistingGearName = scieCirculaire.name.slice(1, 5);
    let manualRecord: ManualInventoryRecord;
    beforeAll(async () => {
      const gears = [marteau, perceuse, scieCirculaire];
      const gearRepository = new InMemoryGears(gears);
      manualRecord = new ManualInventoryRecord(
        gearRepository,
        inexistingGearCode,
        inexistingGearName,
        12,
        "Cave du E",
      );
    });
    it("should inform user gear is not found", async () => {
      await expect(
        async () => await manualRecord.toInventoryRecord(),
      ).rejects.toThrow(
        `Gear ${inexistingGearName} (${inexistingGearCode}) doesn't exist`,
      );
    });
    it("should be able to retrieve manual inventory record", async () => {
      await expect(
        async () => await manualRecord.toInventoryRecord(),
      ).rejects.toHaveProperty("record", manualRecord);
    });
  });
  describe("When updating an error with existing gear", () => {
    const gears = [marteau, perceuse, scieCirculaire];
    const gearRepository = new InMemoryGears(gears);
    const quantity = 12;
    const storage = "local";
    const manualRecord = new ManualInventoryRecord(
      gearRepository,
      "",
      "test",
      quantity,
      storage,
    );
    it("should generate an inventory record", () => {
      const error = new ManualInventoryRecordError(manualRecord);
      const displayableError =
        DisplayableManualInventoryRecordError.fromError(error);
      const inventoryRecord =
        displayableError.toInventoryRecord(scieCirculaire);
      expect(inventoryRecord.quantity).toBe(quantity);
      expect(inventoryRecord.gear).toBe(scieCirculaire);
      expect(inventoryRecord.storage).toBe(storage);
    });
  });
});
