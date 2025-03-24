import {
  CatalogCategory,
  CatalogGear,
  InventoryGroupedRecord,
} from "@overbookd/http";
import { InventoryService, toLiteRecord } from "./inventory.service";
import { InMemoryInventoryRepository } from "./repositories/inventory.repository.inmemory";
import { beforeAll, describe, expect, it } from "vitest";

const teamMatos = { name: "Orga Logistique Matos", code: "matos" };

const OUTILS: CatalogCategory = {
  id: 2,
  name: "Outils",
  path: "bricollage->outils",
  owner: teamMatos,
  parent: 1,
};

const MOBILIER: CatalogCategory = {
  id: 3,
  name: "Mobilier",
  path: "mobilier",
  owner: teamMatos,
};

const PONCEUSE: CatalogGear = {
  id: 5,
  name: "Ponçeuse",
  slug: "ponceuse",
  category: {
    id: OUTILS.id,
    path: OUTILS.path,
    name: OUTILS.name,
  },
  owner: teamMatos,
  code: "BR_OU_005",
  isPonctualUsage: true,
  isConsumable: false,
};

const MARTEAU: CatalogGear = {
  id: 1,
  name: "Marteau",
  slug: "marteau",
  category: {
    id: OUTILS.id,
    path: OUTILS.path,
    name: OUTILS.name,
  },
  owner: teamMatos,
  code: "BR_OU_001",
  isPonctualUsage: true,
  isConsumable: false,
};

const TABLE: CatalogGear = {
  id: 6,
  name: "Table",
  slug: "table",
  category: {
    id: MOBILIER.id,
    path: MOBILIER.path,
    name: MOBILIER.name,
  },
  owner: teamMatos,
  code: "MO_006",
  isPonctualUsage: false,
  isConsumable: false,
};

describe("Inventory Service", () => {
  describe("Setup inventory", () => {
    const inventoryRepository = new InMemoryInventoryRepository();
    const inventoryService = new InventoryService(inventoryRepository);
    describe("when ask to setup inventory with 2 records for different gear", () => {
      let inventory: InventoryGroupedRecord[];
      beforeAll(async () => {
        inventory = await inventoryService.setup([
          {
            quantity: 3,
            gear: PONCEUSE,
            storage: "Local",
          },
          {
            quantity: 5,
            gear: MARTEAU,
            storage: "Local",
            comment: "Pool des assos",
          },
        ]);
      });
      it("should return the new catalog with 2 grouped record", () => {
        expect(inventory).toHaveLength(2);
        expect(inventory).toContainEqual({
          quantity: 3,
          gear: PONCEUSE,
          records: [
            {
              quantity: 3,
              storage: "Local",
            },
          ],
        });
        expect(inventory).toContainEqual({
          quantity: 5,
          gear: MARTEAU,
          records: [
            {
              quantity: 5,
              storage: "Local",
              comment: "Pool des assos",
            },
          ],
        });
      });
      it("should persist the inventory after setup", async () => {
        const persistInventory = await inventoryService.search({});
        expect(persistInventory).toEqual(inventory);
      });
    });
    describe("when ask to setup inventory with 3 records for same gear", () => {
      it("should return a unique grouped record with the sum of quantities", async () => {
        const records = [
          { quantity: 3, gear: TABLE, storage: "Local", comment: "Très usées" },
          { quantity: 20, gear: TABLE, storage: "Cave du E" },
          { quantity: 7, gear: TABLE, storage: "Conteneur H" },
        ];
        const inventory = await inventoryService.setup(records);
        expect(inventory).toHaveLength(1);
        expect(inventory).toContainEqual({
          quantity: 30,
          gear: TABLE,
          records: records.map(toLiteRecord),
        });
      });
    });
    describe("when ask to setup inventory with several records", () => {
      it("should return grouped records with the sum of quantities", async () => {
        const tableRecords = [
          { quantity: 3, gear: TABLE, storage: "Local" },
          { quantity: 20, gear: TABLE, storage: "Cave du E" },
          { quantity: 7, gear: TABLE, storage: "Conteneur H" },
        ];
        const ponceuseRecords = [
          {
            quantity: 3,
            gear: PONCEUSE,
            storage: "Local",
          },
        ];
        const marteauRecords = [
          {
            quantity: 5,
            gear: MARTEAU,
            storage: "Local",
            comment: "Pool des assos",
          },
          {
            quantity: 15,
            gear: MARTEAU,
            storage: "Conteneur H",
          },
        ];
        const inventory = await inventoryService.setup([
          ...tableRecords,
          ...ponceuseRecords,
          ...marteauRecords,
        ]);
        expect(inventory).toHaveLength(3);
        expect(inventory).toContainEqual({
          quantity: 30,
          gear: TABLE,
          records: tableRecords.map(toLiteRecord),
        });
        expect(inventory).toContainEqual({
          quantity: 3,
          gear: PONCEUSE,
          records: ponceuseRecords.map(toLiteRecord),
        });
        expect(inventory).toContainEqual({
          quantity: 20,
          gear: MARTEAU,
          records: marteauRecords.map(toLiteRecord),
        });
      });
    });
  });
  describe("Retrieve inventory grouped records", () => {
    const tableRecords = [
      { quantity: 3, gear: TABLE, storage: "Local" },
      { quantity: 20, gear: TABLE, storage: "Cave du E" },
      { quantity: 7, gear: TABLE, storage: "Conteneur H" },
    ];
    const ponceuseRecords = [
      {
        quantity: 3,
        gear: PONCEUSE,
        storage: "Local",
      },
    ];
    const marteauRecords = [
      {
        quantity: 5,
        gear: MARTEAU,
        storage: "Local",
      },
      {
        quantity: 15,
        gear: MARTEAU,
        storage: "Conteneur H",
      },
    ];
    const records = [...tableRecords, ...marteauRecords, ...ponceuseRecords];
    const inventoryRepository = new InMemoryInventoryRepository(records);
    const inventoryService = new InventoryService(inventoryRepository);
    describe("When searching all grouped records", () => {
      it("should return all grouped records with the sum of quantities", async () => {
        const records = await inventoryService.search({});
        expect(records).toHaveLength(3);
        expect(records).toContainEqual({
          quantity: 30,
          gear: TABLE,
          records: tableRecords.map(toLiteRecord),
        });
        expect(records).toContainEqual({
          quantity: 3,
          gear: PONCEUSE,
          records: ponceuseRecords.map(toLiteRecord),
        });
        expect(records).toContainEqual({
          quantity: 20,
          gear: MARTEAU,
          records: marteauRecords.map(toLiteRecord),
        });
      });
    });
    describe.each`
      search        | searchCategory | searchOwner  | searchPonctualUsage | searchStorage | expectedGroupedRecords
      ${TABLE.name} | ${undefined}   | ${undefined} | ${undefined}        | ${undefined}  | ${[{ quantity: 30, gear: TABLE, records: tableRecords.map(toLiteRecord) }]}
      ${"A"}        | ${undefined}   | ${undefined} | ${undefined}        | ${undefined}  | ${[{ quantity: 30, gear: TABLE, records: tableRecords.map(toLiteRecord) }, { quantity: 20, gear: MARTEAU, records: marteauRecords.map(toLiteRecord) }]}
      ${"Unknown"}  | ${undefined}   | ${undefined} | ${undefined}        | ${undefined}  | ${[]}
      ${"Br"}       | ${undefined}   | ${undefined} | ${undefined}        | ${undefined}  | ${[{ quantity: 20, gear: MARTEAU, records: marteauRecords.map(toLiteRecord) }, { quantity: 3, gear: PONCEUSE, records: ponceuseRecords.map(toLiteRecord) }]}
      ${undefined}  | ${"MobIli"}    | ${undefined} | ${undefined}        | ${undefined}  | ${[{ quantity: 30, gear: TABLE, records: tableRecords.map(toLiteRecord) }]}
      ${"A"}        | ${"BricO"}     | ${undefined} | ${undefined}        | ${undefined}  | ${[{ quantity: 20, gear: MARTEAU, records: marteauRecords.map(toLiteRecord) }]}
      ${undefined}  | ${undefined}   | ${"mAt"}     | ${undefined}        | ${undefined}  | ${[{ quantity: 30, gear: TABLE, records: tableRecords.map(toLiteRecord) }, { quantity: 20, gear: MARTEAU, records: marteauRecords.map(toLiteRecord) }, { quantity: 3, gear: PONCEUSE, records: ponceuseRecords.map(toLiteRecord) }]}
      ${undefined}  | ${undefined}   | ${undefined} | ${true}             | ${undefined}  | ${[{ quantity: 20, gear: MARTEAU, records: marteauRecords.map(toLiteRecord) }, { quantity: 3, gear: PONCEUSE, records: ponceuseRecords.map(toLiteRecord) }]}
      ${undefined}  | ${undefined}   | ${undefined} | ${undefined}        | ${"LocAl"}    | ${[{ quantity: 3, gear: TABLE, records: [toLiteRecord(tableRecords[0])] }, { quantity: 5, gear: MARTEAU, records: [toLiteRecord(marteauRecords[0])] }, { quantity: 3, gear: PONCEUSE, records: [toLiteRecord(ponceuseRecords[0])] }]}
      ${undefined}  | ${undefined}   | ${undefined} | ${true}             | ${"tenEur"}   | ${[{ quantity: 15, gear: MARTEAU, records: [toLiteRecord(marteauRecords[1])] }]}
      ${undefined}  | ${undefined}   | ${undefined} | ${undefined}        | ${"h"}        | ${[{ quantity: 7, gear: TABLE, records: [toLiteRecord(tableRecords[2])] }, { quantity: 15, gear: MARTEAU, records: [toLiteRecord(marteauRecords[1])] }]}
    `(
      'When looking for "$search" in $searchCategory category with $searchOwner owner with ponctual usage: $searchPonctualUsage and storage location: $searchStorage',
      ({
        search,
        searchCategory,
        searchOwner,
        searchPonctualUsage,
        searchStorage,
        expectedGroupedRecords,
      }) => {
        it("should return all grouped records matching the gear", async () => {
          const records = await inventoryService.search({
            search,
            category: searchCategory,
            owner: searchOwner,
            ponctualUsage: searchPonctualUsage,
            storage: searchStorage,
          });
          expect(records).toHaveLength(expectedGroupedRecords.length);
          expect(records).toEqual(expectedGroupedRecords);
        });
      },
    );
  });
  describe("Retrieve inventory records for a dedicated gear", () => {
    const records = [
      { quantity: 3, gear: TABLE, storage: "Local" },
      { quantity: 20, gear: TABLE, storage: "Cave du E" },
      { quantity: 7, gear: TABLE, storage: "Conteneur H" },
      {
        quantity: 3,
        gear: PONCEUSE,
        storage: "Local",
      },
      {
        quantity: 5,
        gear: MARTEAU,
        storage: "Local",
      },
      {
        quantity: 15,
        gear: MARTEAU,
        storage: "Conteneur H",
      },
    ];
    const inventoryRepository = new InMemoryInventoryRepository(records);
    const inventoryService = new InventoryService(inventoryRepository);
    describe.each`
      gear                          | expectedRecords
      ${MARTEAU}                    | ${[{ quantity: 5, gear: MARTEAU, storage: "Local" }, { quantity: 15, gear: MARTEAU, storage: "Conteneur H" }]}
      ${TABLE}                      | ${[{ quantity: 3, gear: TABLE, storage: "Local" }, { quantity: 20, gear: TABLE, storage: "Cave du E" }, { quantity: 7, gear: TABLE, storage: "Conteneur H" }]}
      ${{ name: "Unkownn", id: 0 }} | ${[]}
    `(
      "When looking for $gear.name inventory records",
      ({ gear, expectedRecords }) => {
        it(`should return all ${expectedRecords.length} records matching it`, async () => {
          const res = await inventoryService.getDetails(gear.id);
          expect(res).toHaveLength(expectedRecords.length);
        });
      },
    );
  });
  describe("Retrieve inventory records storages", () => {
    const records = [
      { quantity: 3, gear: TABLE, storage: "Local" },
      { quantity: 20, gear: TABLE, storage: "Cave du E" },
      { quantity: 7, gear: TABLE, storage: "Conteneur H" },
      {
        quantity: 3,
        gear: PONCEUSE,
        storage: "Local",
      },
      {
        quantity: 5,
        gear: MARTEAU,
        storage: "Local",
      },
      {
        quantity: 15,
        gear: MARTEAU,
        storage: "Conteneur H",
      },
    ];
    const inventoryRepository = new InMemoryInventoryRepository(records);
    const inventoryService = new InventoryService(inventoryRepository);
    describe("When searching storage locations", () => {
      it("should return all storages", async () => {
        const res = await inventoryService.getStoragesHavingGear();
        expect(res).toHaveLength(3);
        expect(res).toEqual(["Local", "Cave du E", "Conteneur H"]);
      });
    });
  });
});
