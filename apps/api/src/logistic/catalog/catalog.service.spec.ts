import { CatalogCategory, CatalogGear } from "@overbookd/http";
import { CatalogService } from "./catalog.service";
import {
  InMemoryCategoryRepository,
  InMemoryGearRepository,
} from "./repositories/in-memory";
import {
  CatalogGearWithLinkedItems,
  EMPTY_GEAR_LINKED_ITEMS,
} from "./repositories/in-memory/gear.repository.inmemory";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

const teamMatos = { name: "Orga Logistique Matos", code: "matos" };
const teamBarriere = { name: "Orga Logistique et Securite", code: "barrieres" };

const CATEGORIES: CatalogCategory[] = [
  {
    id: 1,
    name: "Bricollage",
    path: "bricollage",
    owner: teamMatos,
  },
  {
    id: 2,
    name: "Outils",
    path: "bricollage->outils",
    owner: teamMatos,
    parent: 1,
  },
  {
    id: 3,
    name: "Mobilier",
    path: "mobilier",
    owner: teamMatos,
  },
  {
    id: 4,
    name: "Divers",
    path: "divers",
  },
  {
    id: 5,
    name: "Barrieres",
    path: "barrieres",
    owner: teamBarriere,
  },
  {
    id: 6,
    name: "Nettoyage",
    path: "nettoyage",
    owner: teamMatos,
  },
];

const PERCEUSE: CatalogGearWithLinkedItems = {
  id: 1,
  name: "Perceuse",
  slug: "perceuse",
  category: {
    id: CATEGORIES[1].id,
    path: CATEGORIES[1].path,
    name: CATEGORIES[1].name,
  },
  owner: teamMatos,
  code: "BR_OU_001",
  isPonctualUsage: true,
  isConsumable: false,
  ...EMPTY_GEAR_LINKED_ITEMS,
  tasks: [2],
  purchases: [4],
};

const CHAISE = {
  id: 2,
  name: "Chaise",
  slug: "chaise",
  category: {
    id: CATEGORIES[2].id,
    path: CATEGORIES[2].path,
    name: CATEGORIES[2].name,
  },
  owner: teamMatos,
  code: "MO_002",
  isPonctualUsage: false,
  isConsumable: false,
  ...EMPTY_GEAR_LINKED_ITEMS,
};

const TIREUSE = {
  id: 3,
  name: "Tireuse",
  slug: "tireuse",
  isPonctualUsage: false,
  isConsumable: false,
  ...EMPTY_GEAR_LINKED_ITEMS,
  actitivities: [1, 5],
  borrows: [3],
};

const GEARS: CatalogGearWithLinkedItems[] = [PERCEUSE, CHAISE, TIREUSE];

const TABLIER: CatalogGearWithLinkedItems = {
  id: 4,
  name: "Tablier",
  slug: "tablier",
  isPonctualUsage: true,
  isConsumable: false,
  ...EMPTY_GEAR_LINKED_ITEMS,
};

const PONCEUSE: CatalogGearWithLinkedItems = {
  id: 5,
  name: "Ponçeuse",
  slug: "ponceuse",
  category: {
    id: CATEGORIES[1].id,
    path: CATEGORIES[1].path,
    name: CATEGORIES[1].name,
  },
  owner: teamMatos,
  code: "BR_OU_005",
  isPonctualUsage: true,
  isConsumable: false,
  ...EMPTY_GEAR_LINKED_ITEMS,
};

const SIMILAR_GEARS: CatalogGearWithLinkedItems[] = [
  ...GEARS,
  TABLIER,
  PONCEUSE,
  {
    id: 6,
    name: "Table",
    slug: "table",
    category: {
      id: CATEGORIES[2].id,
      path: CATEGORIES[2].path,
      name: CATEGORIES[2].name,
    },
    owner: teamMatos,
    code: "MO_006",
    isPonctualUsage: false,
    isConsumable: false,
    ...EMPTY_GEAR_LINKED_ITEMS,
  },
];

describe("Catalog", () => {
  const categoryRepository = new InMemoryCategoryRepository();
  const gearRepository = new InMemoryGearRepository();
  const catalog = new CatalogService(categoryRepository, gearRepository);
  beforeAll(() => {
    categoryRepository.categories = CATEGORIES;
    gearRepository.gears = GEARS;
  });

  describe("Get gear", () => {
    describe.each`
      gearId | expectedGear
      ${1}   | ${GEARS[0]}
      ${2}   | ${GEARS[1]}
      ${3}   | ${GEARS[2]}
    `("When #$gearId gear exists", ({ gearId, expectedGear }) => {
      it(`should retrieve #${gearId} gear information`, async () => {
        const gear = await catalog.find(gearId);
        expect(expectedGear).toMatchObject(gear);
      });
    });
    describe("When gear doesn't exist", () => {
      it("should inform the user gear doesn't exist", async () => {
        await expect(async () => await catalog.find(123)).rejects.toThrow(
          `Gear #${123} doesn't exist`,
        );
      });
    });
  });

  describe("Add gear", () => {
    describe.each`
      name               | category     | isPonctualUsage | isConsumable | expectedSlug       | expectedCategory                                         | expectedCodeStart | expectedOwner
      ${"Marteau"}       | ${2}         | ${true}         | ${false}     | ${"marteau"}       | ${{ id: 2, name: "Outils", path: "bricollage->outils" }} | ${"BR_OU_"}       | ${{ name: teamMatos.name, code: teamMatos.code }}
      ${"Scie Sauteuse"} | ${2}         | ${true}         | ${false}     | ${"scie-sauteuse"} | ${{ id: 2, name: "Outils", path: "bricollage->outils" }} | ${"BR_OU_"}       | ${{ name: teamMatos.name, code: teamMatos.code }}
      ${"Table"}         | ${3}         | ${false}        | ${false}     | ${"table"}         | ${{ id: 3, name: "Mobilier", path: "mobilier" }}         | ${"MO_"}          | ${{ name: teamMatos.name, code: teamMatos.code }}
      ${"Des"}           | ${undefined} | ${false}        | ${false}     | ${"des"}           | ${undefined}                                             | ${undefined}      | ${undefined}
      ${"Gants"}         | ${4}         | ${true}         | ${false}     | ${"gants"}         | ${{ id: 4, name: "Divers", path: "divers" }}             | ${"DI_"}          | ${undefined}
      ${"Vauban"}        | ${5}         | ${false}        | ${false}     | ${"vauban"}        | ${{ id: 5, name: "Barrieres", path: "barrieres" }}       | ${"BA_"}          | ${{ name: teamBarriere.name, code: teamBarriere.code }}
      ${"Colson"}        | ${1}         | ${true}         | ${true}      | ${"colson"}        | ${{ id: 1, name: "Bricollage", path: "bricollage" }}     | ${"BR_"}          | ${{ name: teamMatos.name, code: teamMatos.code }}
      ${"Sac Poubelle"}  | ${6}         | ${false}        | ${true}      | ${"sac-poubelle"}  | ${{ id: 6, name: "Nettoyage", path: "nettoyage" }}       | ${"NE_"}          | ${{ name: teamMatos.name, code: teamMatos.code }}
    `(
      'Add gear "$name" with #$category category to catalog',
      ({
        name,
        category,
        isPonctualUsage,
        isConsumable,
        expectedSlug,
        expectedCategory,
        expectedCodeStart,
        expectedOwner,
      }) => {
        let gear: CatalogGear;
        afterAll(() => {
          gearRepository.gears = GEARS;
        });
        beforeAll(async () => {
          gear = await catalog.add({
            name,
            category,
            isPonctualUsage,
            isConsumable,
          });
        });
        it(`should create gear ${name} with generated id and slug "${expectedSlug}"`, () => {
          expect(gear).toHaveProperty("id");
          expect(gear.id).toEqual(expect.any(Number));
          expect(gear.name).toBe(name);
          expect(gear.slug).toBe(expectedSlug);
        });
        it("should set up ponctual usage property", () => {
          expect(gear.isPonctualUsage).toBe(isPonctualUsage);
        });
        it("should set up consumable property", () => {
          expect(gear.isConsumable).toBe(isConsumable);
        });
        if (expectedCategory) {
          it(`should link gear ${name} to category "${expectedCategory.name}"`, () => {
            expect(gear.category).toEqual(expectedCategory);
          });
          it("should generate a reference code", () => {
            expect(gear.code.startsWith(expectedCodeStart)).toBe(true);
          });
        }
        if (expectedOwner) {
          it(`should link gear ${name} to team "${expectedOwner.name}"`, () => {
            expect(gear.owner).toEqual(expectedOwner);
          });
        }
        it("should be accessible after", async () => {
          const fetchedGear = await catalog.find(gear.id);
          expect(gear).toMatchObject(fetchedGear);
        });
      },
    );
    describe("When specified category doesn't exist", () => {
      it("should inform the user category doesn't exist", async () => {
        await expect(
          async () =>
            await catalog.add({
              name: "Random",
              category: 123,
              isPonctualUsage: false,
              isConsumable: false,
            }),
        ).rejects.toThrow(`Category #${123} doesn't exist`);
      });
    });
    describe("When a similar gear already exist (i.e. slug are the same)", () => {
      it("should inform user a similar gear already exists", async () => {
        await expect(
          async () =>
            await catalog.add({
              name: "Perçeuse",
              category: 2,
              isPonctualUsage: true,
              isConsumable: false,
            }),
        ).rejects.toThrow('"Perceuse" gear already exist');
      });
    });
  });

  describe("Update gear", () => {
    describe.each`
      toUpdateGear                                      | expectedSlug        | expectedCategory
      ${{ id: 1, name: "Perceuse à vis", category: 2 }} | ${"perceuse-a-vis"} | ${{ id: 2, name: "Outils", path: "bricollage->outils" }}
      ${{ id: 3, name: "Tireuse", category: 3 }}        | ${"tireuse"}        | ${{ id: 3, name: "Mobilier", path: "mobilier" }}
      ${{ id: 2, name: "Transat" }}                     | ${"transat"}        | ${undefined}
    `(
      `When update #$toUpdateGear.id existing gear
      with $toUpdateGear.name as name
      with #$toUpdateGear.category as category
    `,
      ({ toUpdateGear, expectedSlug, expectedCategory }) => {
        it(`should update gear slug to ${expectedSlug}`, async () => {
          const updatedGear = await catalog.update(toUpdateGear);
          expect(updatedGear.slug).toBe(expectedSlug);
        });
        it("should persist update", async () => {
          await catalog.update(toUpdateGear);
          const updatedGear = await catalog.find(toUpdateGear.id);
          const expectedGear = {
            ...toUpdateGear,
            slug: expectedSlug,
            category: expectedCategory,
          };
          expect(updatedGear).toMatchObject(expectedGear);
        });
        if (expectedCategory) {
          it(`should link ${toUpdateGear.name} to ${expectedCategory.name} category`, async () => {
            const updatedGear = await catalog.update(toUpdateGear);
            expect(updatedGear.category).toEqual(expectedCategory);
          });
        }
      },
    );
    describe("When gear doesn't exist", () => {
      it("should inform the user gear doesn't exist", async () => {
        await expect(
          async () =>
            await catalog.update({
              id: 123,
              name: "Lavabo",
              isPonctualUsage: false,
              isConsumable: false,
            }),
        ).rejects.toThrow(`Gear #${123} doesn't exist`);
      });
    });
  });

  describe("Delete gear", () => {
    beforeEach(() => {
      gearRepository.gears = GEARS;
    });
    describe.each`
      toDeleteGearId
      ${CHAISE.id}
      ${123}
    `("Delete #$toDeleteGearId gear", ({ toDeleteGearId }) => {
      it(`should remove #${toDeleteGearId} gear from persistance`, async () => {
        await catalog.remove(toDeleteGearId);
        await expect(
          async () => await catalog.find(toDeleteGearId),
        ).rejects.toThrow(`Gear #${toDeleteGearId} doesn't exist`);
      });
    });
    describe.each`
      toDeleteGearId | expectedError
      ${PERCEUSE.id} | ${`Impossible de supprimer le matériel, il est lié à : FT 2, Fiche Achat 4`}
      ${TIREUSE.id}  | ${`Impossible de supprimer le matériel, il est lié à : FA 1, FA 5, Fiche Emprunt 3`}
    `(
      "When gear #$toDeleteGearId is used in linked items",
      ({ toDeleteGearId, expectedError }) => {
        it("should indicate that gear can't be deleted", async () => {
          await expect(
            async () => await catalog.remove(toDeleteGearId),
          ).rejects.toThrow(expectedError);
        });
      },
    );
  });

  describe("Search gear", () => {
    beforeAll(() => {
      gearRepository.gears = SIMILAR_GEARS;
    });
    afterAll(() => {
      gearRepository.gears = GEARS;
    });
    describe.each`
      search       | searchCategory  | searchOwner  | searchPonctualUsage | expectedGears
      ${"TAblIer"} | ${undefined}    | ${undefined} | ${undefined}        | ${[TABLIER]}
      ${"TAblI"}   | ${undefined}    | ${undefined} | ${undefined}        | ${[TABLIER]}
      ${"TAbl"}    | ${undefined}    | ${undefined} | ${undefined}        | ${[TABLIER, SIMILAR_GEARS[5]]}
      ${"TAblI"}   | ${"Mobilier"}   | ${undefined} | ${undefined}        | ${[]}
      ${"euse"}    | ${undefined}    | ${undefined} | ${undefined}        | ${[PERCEUSE, SIMILAR_GEARS[2], PONCEUSE]}
      ${"euse"}    | ${"BricolLage"} | ${undefined} | ${undefined}        | ${[PERCEUSE, PONCEUSE]}
      ${undefined} | ${undefined}    | ${"Matos"}   | ${undefined}        | ${[PERCEUSE, SIMILAR_GEARS[1], PONCEUSE, SIMILAR_GEARS[5]]}
      ${undefined} | ${undefined}    | ${"maT"}     | ${undefined}        | ${[PERCEUSE, SIMILAR_GEARS[1], PONCEUSE, SIMILAR_GEARS[5]]}
      ${"tab"}     | ${undefined}    | ${"maT"}     | ${undefined}        | ${[SIMILAR_GEARS[5]]}
      ${"tab"}     | ${"Brico"}      | ${"maT"}     | ${undefined}        | ${[]}
      ${undefined} | ${undefined}    | ${undefined} | ${undefined}        | ${SIMILAR_GEARS}
      ${undefined} | ${undefined}    | ${undefined} | ${true}             | ${[PERCEUSE, TABLIER, PONCEUSE]}
      ${"Br_ou"}   | ${undefined}    | ${undefined} | ${undefined}        | ${[PERCEUSE, PONCEUSE]}
    `(
      'When looking for "$search" in $searchCategory category with $searchOwner owner with ponctual usage: $searchPonctualUsage',
      ({
        search,
        searchCategory,
        searchOwner,
        searchPonctualUsage,
        expectedGears,
      }) => {
        it(`should retrieve ${expectedGears.length} gears`, async () => {
          const gears = await catalog.search({
            search,
            category: searchCategory,
            owner: searchOwner,
            ponctualUsage: searchPonctualUsage,
          });
          expect(gears).toEqual(expectedGears);
        });
      },
    );
  });
});
