import { CatalogGearManager } from "./gear-manager.js";
import {
  BARRIERES_CATEGORY,
  BARRIERES_OWNER,
  BRICOLAGE_CATEGORY,
  CHAISE,
  CHAISE_WITH_CODE,
  DIVERS_CATEGORY,
  MATOS_OWNER,
  MOBILIER_CATEGORY,
  NETTOYAGE_CATEGORY,
  OUTILS_CATEGORY,
  PERCEUSE,
  PERCEUSE_WITH_CODE,
  TIREUSE,
  TIREUSE_WITH_CODE,
} from "../catalog.test-utils.js";
import { CatalogGear, GearLinkedItems, SavedCatalogGear } from "./gear.js";
import {
  EMPTY_GEAR_LINKED_ITEMS,
  InMemoryCatalogGears,
} from "./gears.inmemory.js";
import { beforeEach, describe, expect, it } from "vitest";

const PERCEUSE_LINKED_ITEMS: GearLinkedItems = {
  ...EMPTY_GEAR_LINKED_ITEMS,
  tasks: [2],
};

const TIREUSE_LINKED_ITEMS: GearLinkedItems = {
  ...EMPTY_GEAR_LINKED_ITEMS,
  activities: [1, 5],
  borrows: [3],
};

const GEARS: SavedCatalogGear[] = [PERCEUSE, CHAISE, TIREUSE];
const GEARS_LINKED_ITEMS = {
  [PERCEUSE.id]: PERCEUSE_LINKED_ITEMS,
  [TIREUSE.id]: TIREUSE_LINKED_ITEMS,
};

describe("Catalog Gear Manager", () => {
  let gearRepository: InMemoryCatalogGears;
  let catalog: CatalogGearManager;

  beforeEach(() => {
    gearRepository = new InMemoryCatalogGears(GEARS, GEARS_LINKED_ITEMS);
    catalog = new CatalogGearManager(gearRepository);
  });

  describe("Get gear", () => {
    describe.each`
      gearId         | expectedGear
      ${PERCEUSE.id} | ${PERCEUSE_WITH_CODE}
      ${CHAISE.id}   | ${CHAISE_WITH_CODE}
      ${TIREUSE.id}  | ${TIREUSE_WITH_CODE}
    `("When #$gearId gear exists", ({ gearId, expectedGear }) => {
      it(`should retrieve #${gearId} gear information and compute its code`, async () => {
        const gear = await catalog.find(gearId);
        expect(expectedGear).toMatchObject(gear);
      });
    });
    describe("When gear doesn't exist", () => {
      it("should indicate that the gear doesn't exist", async () => {
        await expect(async () => catalog.find(123)).rejects.toThrow(
          "Le matos #123 n'existe pas",
        );
      });
    });
  });

  describe("Add gear", () => {
    describe.each`
      name               | category              | isPonctualUsage | isConsumable | expectedSlug       | expectedCodeStart | expectedOwner
      ${"Marteau"}       | ${OUTILS_CATEGORY}    | ${true}         | ${false}     | ${"marteau"}       | ${"BR_OU_"}       | ${MATOS_OWNER}
      ${"Scie Sauteuse"} | ${OUTILS_CATEGORY}    | ${true}         | ${false}     | ${"scie-sauteuse"} | ${"BR_OU_"}       | ${MATOS_OWNER}
      ${"Table"}         | ${MOBILIER_CATEGORY}  | ${false}        | ${false}     | ${"table"}         | ${"MO_"}          | ${MATOS_OWNER}
      ${"Des"}           | ${undefined}          | ${false}        | ${false}     | ${"des"}           | ${undefined}      | ${undefined}
      ${"Gants"}         | ${DIVERS_CATEGORY}    | ${true}         | ${false}     | ${"gants"}         | ${"DI_"}          | ${undefined}
      ${"Vauban"}        | ${BARRIERES_CATEGORY} | ${false}        | ${false}     | ${"vauban"}        | ${"BA_"}          | ${BARRIERES_OWNER}
      ${"Colson"}        | ${BRICOLAGE_CATEGORY} | ${true}         | ${true}      | ${"colson"}        | ${"BR_"}          | ${MATOS_OWNER}
      ${"Sac Poubelle"}  | ${NETTOYAGE_CATEGORY} | ${false}        | ${true}      | ${"sac-poubelle"}  | ${"NE_"}          | ${MATOS_OWNER}
    `(
      'Add gear "$name" with category "$category.name" to catalog',
      ({
        name,
        category,
        isPonctualUsage,
        isConsumable,
        expectedSlug,
        expectedCodeStart,
        expectedOwner,
      }) => {
        let gear: CatalogGear;
        beforeEach(async () => {
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
        if (category) {
          it(`should link gear ${name} to category "${category.name}"`, () => {
            expect(gear.category).toMatchObject(category);
          });
          it("should generate a reference code", () => {
            expect((gear.code ?? "").startsWith(expectedCodeStart)).toBe(true);
          });
        }
        if (expectedOwner) {
          it(`should link gear ${name} to team "${expectedOwner.name}"`, () => {
            expect(gear.owner).toEqual(expectedOwner);
          });
        }
        it("should be accessible after", async () => {
          const fetchedGear = gearRepository.savedGears.find(
            (g) => g.id === gear.id,
          );
          expect(gear).toMatchObject(fetchedGear!);
        });
      },
    );
    describe("When a similar gear already exist (i.e. slug are the same)", () => {
      it("should inform user a similar gear already exists", async () => {
        await expect(
          async () =>
            await catalog.add({
              name: "Perçeuse",
              isPonctualUsage: true,
              isConsumable: false,
            }),
        ).rejects.toThrow('Le matos "Perceuse" existe déjà');
      });
    });
  });

  describe("Update gear", () => {
    describe.each`
      toUpdateGear                                                                                                 | expectedSlug        | expectedCategory
      ${{ id: 1, name: "Perceuse à vis", category: OUTILS_CATEGORY, isPonctualUsage: false, isConsumable: false }} | ${"perceuse-a-vis"} | ${OUTILS_CATEGORY}
      ${{ id: 3, name: "Tireuse", category: MOBILIER_CATEGORY, isPonctualUsage: true, isConsumable: false }}       | ${"tireuse"}        | ${MOBILIER_CATEGORY}
      ${{ id: 2, name: "Transat", isPonctualUsage: false, isConsumable: true }}                                    | ${"transat"}        | ${undefined}
    `(
      `When update #$toUpdateGear.id existing gear
        with $toUpdateGear.name as name and with $toUpdateGear.category.name as category
      `,
      ({ toUpdateGear, expectedSlug, expectedCategory }) => {
        it(`should update gear slug to ${expectedSlug}`, async () => {
          const updatedGear = await catalog.update(toUpdateGear);
          expect(updatedGear.slug).toBe(expectedSlug);
        });
        it("should persist update", async () => {
          await catalog.update(toUpdateGear);
          const updatedGear = gearRepository.savedGears.find(
            (g) => g.id === toUpdateGear.id,
          );
          const expectedGear = { ...toUpdateGear, slug: expectedSlug };
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
        ).rejects.toThrow(`Le matos #${123} n'existe pas`);
      });
    });
  });

  describe("Delete gear", () => {
    describe.each`
      toDeleteGearId
      ${CHAISE.id}
      ${123}
    `("Delete #$toDeleteGearId gear", ({ toDeleteGearId }) => {
      beforeEach(() => {
        gearRepository = new InMemoryCatalogGears(GEARS);
        catalog = new CatalogGearManager(gearRepository);
      });
      it(`should remove #${toDeleteGearId} gear from persistance`, async () => {
        await catalog.remove(toDeleteGearId);
        expect(
          gearRepository.savedGears.find((g) => g.id === toDeleteGearId),
        ).toBeUndefined();
      });
    });
    describe.each`
      toDeleteGearId | expectedError
      ${PERCEUSE.id} | ${`Impossible de supprimer le matériel, il est lié à : FT 2`}
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
});
