import { describe, it, expect } from "vitest";
import type { Gears } from "./gears";
import { InMemoryGears } from "./gears.inmemory";
import {
  InventoryImport,
  InventoryImportContainer,
  type InventoryImportRaw,
} from "./inventory-import";
import { ManualInventoryRecord } from "./manual-inventory-record";
import { marteau, perceuse, scieCirculaire } from "./test-helper";

class FakeInventoryImportContainer extends InventoryImportContainer {
  constructor(
    private readonly raws: InventoryImportRaw[],
    gearRepository: Gears,
  ) {
    super(gearRepository);
  }
  extractManualRecords(): Promise<ManualInventoryRecord[]> {
    return Promise.resolve(this.convertImportRawsToManualRecords(this.raws));
  }
}

const perceuseInLocal: InventoryImportRaw = {
  code: "BR_OU_002",
  gear: "Perceuse",
  quantity: 2,
  storage: "Local",
};

const perceuseInConteneurH: InventoryImportRaw = {
  code: "BR_OU_002",
  gear: "Perceuse",
  quantity: 3,
  storage: "Conteneur H",
};

const marteauInLocal: InventoryImportRaw = {
  code: "BR_OU_001",
  gear: "Marteau",
  quantity: 5,
  storage: "Local",
  comment: "Pool des assos",
};

const marteauInCaveE: InventoryImportRaw = {
  code: "BR_OU_001",
  gear: "Marteau",
  quantity: 3,
  storage: "Cave du E",
};

const scieCirculaireInLocal: InventoryImportRaw = {
  code: "BR_OU_003",
  gear: "Scie Circulaire",
  quantity: 1,
  storage: "Local",
};

describe("Inventory import", () => {
  const gearRepository = new InMemoryGears([marteau, perceuse, scieCirculaire]);
  describe("When importing file with only valid raws", () => {
    const importContainer = new FakeInventoryImportContainer(
      [
        perceuseInLocal,
        perceuseInConteneurH,
        marteauInLocal,
        marteauInCaveE,
        scieCirculaireInLocal,
      ],
      gearRepository,
    );
    it("should transform all raw to InventoryRecord", async () => {
      const { records } = await InventoryImport.toRecords(importContainer);
      expect(records).toHaveLength(5);
      const marteauRecords = records.filter(
        (record) => record.gear.slug === marteau.slug,
      );
      expect(marteauRecords).toHaveLength(2);
      const perceuseRecords = records.filter(
        (record) => record.gear.slug === perceuse.slug,
      );
      expect(perceuseRecords).toHaveLength(2);
      const scieCirculaireRecords = records.filter(
        (record) => record.gear.slug === scieCirculaire.slug,
      );
      expect(scieCirculaireRecords).toHaveLength(1);
    });
  });
  describe("When importing file with raws for the same gear in the same place", () => {
    const importContainer = new FakeInventoryImportContainer(
      [
        perceuseInLocal,
        perceuseInLocal,
        marteauInLocal,
        marteauInLocal,
        scieCirculaireInLocal,
      ],
      gearRepository,
    );
    it("should concacenate quantity for similar raws", async () => {
      const { records } = await InventoryImport.toRecords(importContainer);
      expect(records).toHaveLength(3);
    });
  });
  describe("When importing file with some invalid raws", () => {
    const importContainer = new FakeInventoryImportContainer(
      [
        perceuseInLocal,
        { code: "", gear: "Matos inconnu", quantity: 15, storage: "Local" },
        marteauInLocal,
        {
          code: "BR_OU_004",
          gear: "Martascie",
          quantity: 3,
          storage: "Cave du E",
          comment: "2 en 1",
        },
        scieCirculaireInLocal,
      ],
      gearRepository,
    );
    it("should transform only valid raws", async () => {
      const { records } = await InventoryImport.toRecords(importContainer);
      expect(records).toHaveLength(3);
    });
    it("should provide raws in error", async () => {
      const { errors } = await InventoryImport.toRecords(importContainer);
      expect(errors).toHaveLength(2);
    });
  });
});
