import { describe, beforeAll, expect, it } from "@jest/globals";

import { Gear } from "~/utils/models/catalog.model";
import { InMemoryGearRepository } from "./inmemory-gear.repository";
import { InventoryRecord } from "./inventory-record";
import { ManualInventoryRecord } from "./manual-inventory-record";
import { marteau, perceuse, scieCirculaire } from "./test-helper";

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
          const gearRepository = new InMemoryGearRepository(gears);
          const manualRecord = new ManualInventoryRecord(
            (gear as Gear).name,
            quantity as number,
            storage as string,
            gearRepository
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
      }
    );
  });
  describe("When using a manual record with unexisting gear", () => {
    const inexistingGearName = scieCirculaire.name.slice(1, 5);
    let manualRecord: ManualInventoryRecord;
    beforeAll(async () => {
      const gears = [marteau, perceuse, scieCirculaire];
      const gearRepository = new InMemoryGearRepository(gears);
      manualRecord = new ManualInventoryRecord(
        inexistingGearName,
        12,
        "Cave du E",
        gearRepository
      );
    });
    it("should inform user gear is not found", async () => {
      await expect(
        async () => await manualRecord.toInventoryRecord()
      ).rejects.toThrow(`Gear ${inexistingGearName} doesn't exist`);
    });
    it("should be able to retrieve manual inventory record", async () => {
      await expect(
        async () => await manualRecord.toInventoryRecord()
      ).rejects.toHaveProperty("record", manualRecord);
    });
  });
});
