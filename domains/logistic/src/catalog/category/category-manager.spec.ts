import { beforeEach, describe, expect, it } from "vitest";
import { CatalogCategory } from "./category.js";
import {
  BRICOLAGE_CATEGORY,
  CABLE_CATEGORY,
  CATEGORIES,
  DIVERS_CATEGORY,
  ELEC_OWNER,
  ELECTRIQUE_CATEGORY,
  GROSSE_TENSION_CATEGORY,
  MATOS_OWNER,
  MOBILIER_CATEGORY,
  OUTILS_CATEGORY,
  OWNERS,
  SIGNA_OWNER,
} from "../catalog.test-utils.js";
import { InMemoryCatalogCategories } from "./categories.inmemory.js";
import { InMemoryCatalogTeams } from "./teams.inmemory.js";
import { CatalogCategoryManager } from "./category-manager.js";

describe("Category", () => {
  let categoryRepository: InMemoryCatalogCategories;
  let teamRepository: InMemoryCatalogTeams;
  let categoryManager: CatalogCategoryManager;
  beforeEach(() => {
    categoryRepository = new InMemoryCatalogCategories(CATEGORIES);
    teamRepository = new InMemoryCatalogTeams(OWNERS);
    categoryManager = new CatalogCategoryManager(
      categoryRepository,
      teamRepository,
    );
  });
  describe("get category", () => {
    describe.each`
      categoryId               | expectedCategory
      ${BRICOLAGE_CATEGORY.id} | ${BRICOLAGE_CATEGORY}
      ${OUTILS_CATEGORY.id}    | ${OUTILS_CATEGORY}
      ${MOBILIER_CATEGORY.id}  | ${MOBILIER_CATEGORY}
    `(
      "when category #$categoryId exists",
      ({ categoryId, expectedCategory }) => {
        it(`should retreive category #${categoryId} information`, async () => {
          const category = await categoryManager.find(categoryId);
          expect(category).toMatchObject(expectedCategory);
        });
      },
    );
    describe("when category doesn't exist", () => {
      const inexistantCategory = 999;
      it("should inform that category doesn't exist", async () => {
        await expect(async () =>
          categoryManager.find(inexistantCategory),
        ).rejects.toThrow(`La catégorie #${inexistantCategory} n'existe pas`);
      });
    });
  });
  describe("create a category", () => {
    describe.each`
      name                    | expectedPath
      ${"mobilier extérieur"} | ${"mobilier-exterieur"}
      ${"Mobilier de bureau"} | ${"mobilier-de-bureau"}
      ${"prise secteur 400V"} | ${"prise-secteur-400v"}
    `(
      "$name main category without responsible team",
      ({ name, expectedPath }) => {
        it(`should be created with generated id and "${expectedPath}" as path`, async () => {
          const createdCategory = await categoryManager.create({ name });
          expect(createdCategory).toHaveProperty("id");
          expect(createdCategory.id).toEqual(expect.any(Number));
          expect(createdCategory).toHaveProperty("name");
          expect(createdCategory.name).toBe(name);
          expect(createdCategory).toHaveProperty("path");
          expect(createdCategory.path).toBe(expectedPath);
        });
        it("should be accessible after", async () => {
          const createdCategory = await categoryManager.create({ name });
          const fetchedCategory = categoryRepository.savedCategories.find(
            (category) => category.id === createdCategory.id,
          );
          expect(createdCategory).toMatchObject(fetchedCategory!);
        });
      },
    );
    describe.each`
      name                   | owner      | expectedOwner
      ${"Outillage"}         | ${"matos"} | ${MATOS_OWNER}
      ${"Panneaux Lumineux"} | ${"signa"} | ${SIGNA_OWNER}
      ${"Cables"}            | ${"elec"}  | ${ELEC_OWNER}
    `(
      "$name main category with #$owner owner team",
      ({ name, owner, expectedOwner }) => {
        it(`should associate ${name} category to ${expectedOwner.name} team`, async () => {
          const createdCategory = await categoryManager.create({ name, owner });
          expect(createdCategory.owner).toMatchObject(expectedOwner);
        });
      },
    );
    describe.each`
      name                 | owner        | parentCategory            | expectedPath                     | expectedOwner
      ${"Petit outillage"} | ${"matos"}   | ${BRICOLAGE_CATEGORY.id}  | ${"bricollage->petit-outillage"} | ${MATOS_OWNER}
      ${"Rangements"}      | ${"elec"}    | ${BRICOLAGE_CATEGORY.id}  | ${"bricollage->rangements"}      | ${MATOS_OWNER}
      ${"Rallonges"}       | ${undefined} | ${ELECTRIQUE_CATEGORY.id} | ${"electrique->rallonges"}       | ${ELEC_OWNER}
    `(
      "$name sub category of #$parentCategory category",
      ({ name, owner, parentCategory, expectedPath, expectedOwner }) => {
        it(`should generate composed ${expectedPath} path`, async () => {
          const createdCategory = await categoryManager.create({
            name,
            parent: parentCategory,
            owner,
          });
          expect(createdCategory.path).toBe(expectedPath);
        });
        it(`should be associated to #${parentCategory} category `, async () => {
          const createdCategory = await categoryManager.create({
            name,
            parent: parentCategory,
            owner,
          });
          expect(createdCategory.parent).toBe(parentCategory);
        });
        it(`should be associated to parent category ${expectedOwner.name} team`, async () => {
          const createdCategory = await categoryManager.create({
            name,
            parent: parentCategory,
            owner,
          });
          expect(createdCategory.owner).toMatchObject(expectedOwner);
        });
      },
    );
    describe("when parent category doesn't exist ", () => {
      const categoryName = "Rangement";
      const inexistantParentCategory = 999;
      it("should inform the user parent category doesn't exist", async () => {
        await expect(
          async () =>
            await categoryManager.create({
              name: categoryName,
              parent: inexistantParentCategory,
            }),
        ).rejects.toThrow(
          `La catégorie #${inexistantParentCategory} n'existe pas`,
        );
      });
    });
    describe("when a category already exists", () => {
      it("should inform the user category already exists", async () => {
        await expect(
          async () =>
            await categoryManager.create({
              name: MOBILIER_CATEGORY.name,
            }),
        ).rejects.toThrow(
          `La catégorie "${MOBILIER_CATEGORY.name}" existe déjà`,
        );
      });
    });
  });
  describe("delete a category", () => {
    describe.each`
      toDeleteCategory       | childCategory              | expectedChildParent       | expectedChildPath               | grandChildCategory         | expectedGrandChildPath
      ${BRICOLAGE_CATEGORY}  | ${undefined}               | ${undefined}              | ${undefined}                    | ${undefined}               | ${undefined}
      ${DIVERS_CATEGORY}     | ${undefined}               | ${undefined}              | ${undefined}                    | ${undefined}               | ${undefined}
      ${CABLE_CATEGORY}      | ${GROSSE_TENSION_CATEGORY} | ${ELECTRIQUE_CATEGORY.id} | ${"electrique->grosse-tension"} | ${undefined}               | ${undefined}
      ${ELECTRIQUE_CATEGORY} | ${CABLE_CATEGORY}          | ${undefined}              | ${"cable"}                      | ${GROSSE_TENSION_CATEGORY} | ${"cable->grosse-tension"}
    `(
      `when deleting category $toDeleteCategory.name`,
      ({
        toDeleteCategory,
        childCategory,
        expectedChildParent,
        expectedChildPath,
        grandChildCategory,
        expectedGrandChildPath,
      }) => {
        it(`should remove category #${toDeleteCategory.id} from persistence`, async () => {
          await categoryManager.remove(toDeleteCategory.id);
          expect(
            categoryRepository.savedCategories.find(
              (category) => category.id === toDeleteCategory.id,
            ),
          ).toBeUndefined();
        });
        if (childCategory) {
          it(`should attach child #${childCategory.id} to the deleted category parent`, async () => {
            await categoryManager.remove(toDeleteCategory.id);
            const child = categoryRepository.savedCategories.find(
              (category) => category.id === childCategory.id,
            );
            expect(child!.parent).toBe(expectedChildParent);
          });
          it(`should update child #${childCategory.id} path to "${expectedChildPath}"`, async () => {
            await categoryManager.remove(toDeleteCategory.id);
            const child = categoryRepository.savedCategories.find(
              (category) => category.id === childCategory.id,
            );
            expect(child!.path).toBe(expectedChildPath);
          });
        }
        if (grandChildCategory) {
          it(`should preserve grandchild #${grandChildCategory.id} parent`, async () => {
            await categoryManager.remove(toDeleteCategory.id);
            const grandChild = categoryRepository.savedCategories.find(
              (category) => category.id === grandChildCategory.id,
            );
            expect(grandChild!.parent).toBe(childCategory.id);
          });
          it(`should update grandchild #${grandChildCategory.id} path to "${expectedGrandChildPath}"`, async () => {
            await categoryManager.remove(toDeleteCategory.id);
            const grandChild = categoryRepository.savedCategories.find(
              (category) => category.id === grandChildCategory.id,
            );
            expect(grandChild!.path).toBe(expectedGrandChildPath);
          });
        }
      },
    );
    it("should inherit the new parent owner after deleting Cable", async () => {
      await categoryManager.remove(CABLE_CATEGORY.id);
      const grosseTension = categoryRepository.savedCategories.find(
        (category) => category.id === GROSSE_TENSION_CATEGORY.id,
      );
      expect(grosseTension!.parent).toBe(ELECTRIQUE_CATEGORY.id);
      expect(grosseTension!.path).toBe("electrique->grosse-tension");
      expect(grosseTension!.owner).toEqual(ELEC_OWNER);
    });
    it("should keep the child owner when deleting a root category", async () => {
      await categoryManager.remove(ELECTRIQUE_CATEGORY.id);
      const cable = categoryRepository.savedCategories.find(
        (category) => category.id === CABLE_CATEGORY.id,
      );
      expect(cable!.parent).toBeUndefined();
      expect(cable!.path).toBe("cable");
      expect(cable!.owner).toEqual(ELEC_OWNER);
    });
    it("should update descendant paths after deleting a root category", async () => {
      await categoryManager.remove(ELECTRIQUE_CATEGORY.id);
      const grosseTension = categoryRepository.savedCategories.find(
        (category) => category.id === GROSSE_TENSION_CATEGORY.id,
      );
      expect(grosseTension!.parent).toBe(CABLE_CATEGORY.id);
      expect(grosseTension!.path).toBe("cable->grosse-tension");
      expect(grosseTension!.owner).toEqual(ELEC_OWNER);
    });
  });
  describe("update a category", () => {
    describe(`update category name
      - Update category slug according to new name
      - Cascade slug updates on sub categories
    `, () => {
      describe.each`
        toUpdateCategory                                                                         | expectedPath                                  | childCategory                                                                              | grandChildCategory
        ${{ ...BRICOLAGE_CATEGORY, name: "Bricolles", owner: MATOS_OWNER.code }}                 | ${"bricolles"}                                | ${{ id: OUTILS_CATEGORY.id, expectedPath: "bricolles->outils" }}                           | ${undefined}
        ${{ ...GROSSE_TENSION_CATEGORY, name: "Mega Grosses Tensions", owner: ELEC_OWNER.code }} | ${"electrique->cable->mega-grosses-tensions"} | ${undefined}                                                                               | ${undefined}
        ${{ ...CABLE_CATEGORY, name: "Cablage", owner: ELEC_OWNER.code }}                        | ${"electrique->cablage"}                      | ${{ id: GROSSE_TENSION_CATEGORY.id, expectedPath: "electrique->cablage->grosse-tension" }} | ${undefined}
        ${{ ...ELECTRIQUE_CATEGORY, name: "Electricite", owner: ELEC_OWNER.code }}               | ${"electricite"}                              | ${{ id: CABLE_CATEGORY.id, expectedPath: "electricite->cable" }}                           | ${{ id: GROSSE_TENSION_CATEGORY.id, expectedPath: "electricite->cable->grosse-tension" }}
      `(
        'when update category #$toUpdateCategory.id name to "$toUpdateCategory.name"',
        ({
          toUpdateCategory,
          expectedPath,
          childCategory,
          grandChildCategory,
        }) => {
          it(`should update category path to "${expectedPath}"`, async () => {
            const updatedCategory =
              await categoryManager.update(toUpdateCategory);
            expect(updatedCategory.name).toBe(toUpdateCategory.name);
            expect(updatedCategory.path).toBe(expectedPath);
          });
          if (childCategory) {
            it(`should update #${childCategory.id} child category path to ${childCategory.expectedPath}`, async () => {
              await categoryManager.update(toUpdateCategory);
              const child = categoryRepository.savedCategories.find(
                (category) => category.id === childCategory.id,
              );
              expect(child!.path).toBe(childCategory.expectedPath);
            });
          }
          if (grandChildCategory) {
            it(`should update #${grandChildCategory.id} grandchild category path to ${grandChildCategory.expectedPath}`, async () => {
              await categoryManager.update(toUpdateCategory);
              const child = categoryRepository.savedCategories.find(
                (category) => category.id === grandChildCategory.id,
              );
              expect(child!.path).toBe(grandChildCategory.expectedPath);
            });
          }
        },
      );
    });
    describe(`update category team
      - Update owner only for main categories
      - Cascade owner updates on sub categories
    `, () => {
      describe.each`
        toUpdateCategory                                       | expectedOwner  | childCategory                         | grandChildCategory
        ${{ ...BRICOLAGE_CATEGORY, owner: SIGNA_OWNER.code }}  | ${SIGNA_OWNER} | ${{ id: OUTILS_CATEGORY.id }}         | ${undefined}
        ${{ ...CABLE_CATEGORY, owner: SIGNA_OWNER.code }}      | ${ELEC_OWNER}  | ${{ id: GROSSE_TENSION_CATEGORY.id }} | ${undefined}
        ${{ ...ELECTRIQUE_CATEGORY, owner: SIGNA_OWNER.code }} | ${SIGNA_OWNER} | ${{ id: CABLE_CATEGORY.id }}          | ${{ id: GROSSE_TENSION_CATEGORY.id }}
      `(
        "when update category #$toUpdateCategory.id owner to #$toUpdateCategory.owner team",
        ({
          toUpdateCategory,
          expectedOwner,
          childCategory,
          grandChildCategory,
        }) => {
          it(`should set category owner to "${expectedOwner.name}"`, async () => {
            const updatedCategory =
              await categoryManager.update(toUpdateCategory);
            expect(updatedCategory.owner).toMatchObject(expectedOwner);
          });
          if (childCategory) {
            it(`should set #${childCategory.id} child category owner to "${expectedOwner.name}"`, async () => {
              await categoryManager.update(toUpdateCategory);
              const child = categoryRepository.savedCategories.find(
                (category) => category.id === childCategory.id,
              );
              expect(child!.owner).toMatchObject(expectedOwner);
            });
          }
          if (grandChildCategory) {
            it(`should set #${grandChildCategory.id} grandchild category owner to "${expectedOwner.name}"`, async () => {
              await categoryManager.update(toUpdateCategory);
              const child = categoryRepository.savedCategories.find(
                (category) => category.id === grandChildCategory.id,
              );
              expect(child!.owner).toMatchObject(expectedOwner);
            });
          }
        },
      );
    });
    describe(`update category parent
      - Update category slug
      - Update owner according to new parent category one
      - Cascade slug updates on sub categories
      - Cascade owner changes on sub categories
    `, () => {
      describe.each`
        toUpdateCategory                                                                 | expectedOwner  | expectedPath           | childCategory                                                                            | grandChildCategory
        ${{ ...OUTILS_CATEGORY, parent: MOBILIER_CATEGORY.id, owner: MATOS_OWNER.code }} | ${MATOS_OWNER} | ${"mobilier->outils"}  | ${undefined}                                                                             | ${undefined}
        ${{ ...CABLE_CATEGORY, parent: undefined, owner: ELEC_OWNER.code }}              | ${ELEC_OWNER}  | ${"cable"}             | ${{ id: GROSSE_TENSION_CATEGORY.id, expectedPath: "cable->grosse-tension" }}             | ${undefined}
        ${{ ...CABLE_CATEGORY, parent: BRICOLAGE_CATEGORY.id, owner: ELEC_OWNER.code }}  | ${MATOS_OWNER} | ${"bricollage->cable"} | ${{ id: GROSSE_TENSION_CATEGORY.id, expectedPath: "bricollage->cable->grosse-tension" }} | ${undefined}
      `(
        "when update #$toUpdateCategory.id category parent to #$toUpdateCategory.parent category",
        ({
          toUpdateCategory,
          expectedOwner,
          expectedPath,
          childCategory,
          grandChildCategory,
        }) => {
          it(`should set category owner to "${expectedOwner.name}" team`, async () => {
            const updatedCategory =
              await categoryManager.update(toUpdateCategory);
            expect(updatedCategory.owner).toMatchObject(expectedOwner);
          });
          it(`should update category path to "${expectedPath}"`, async () => {
            const updatedCategory =
              await categoryManager.update(toUpdateCategory);
            expect(updatedCategory.name).toBe(toUpdateCategory.name);
            expect(updatedCategory.path).toBe(expectedPath);
          });
          if (childCategory) {
            it(`should set #${childCategory.id} child category owner to "${expectedOwner.name}"`, async () => {
              await categoryManager.update(toUpdateCategory);
              const child = categoryRepository.savedCategories.find(
                (category) => category.id === childCategory.id,
              );
              expect(child!.owner).toMatchObject(expectedOwner);
            });
            it(`should update #${childCategory.id} child category path to ${childCategory.expectedPath}`, async () => {
              await categoryManager.update(toUpdateCategory);
              const child = categoryRepository.savedCategories.find(
                (category) => category.id === childCategory.id,
              );
              expect(child!.path).toBe(childCategory.expectedPath);
            });
          }
          if (grandChildCategory) {
            it(`should set #${grandChildCategory.id} grandchild category owner to "${expectedOwner.name}"`, async () => {
              await categoryManager.update(toUpdateCategory);
              const child = categoryRepository.savedCategories.find(
                (category) => category.id === grandChildCategory.id,
              );
              expect(child!.owner).toMatchObject(expectedOwner);
            });
            it(`should update #${grandChildCategory.id} grandchild category path to ${grandChildCategory.expectedPath}`, async () => {
              await categoryManager.update(toUpdateCategory);
              const child = categoryRepository.savedCategories.find(
                (category) => category.id === grandChildCategory.id,
              );
              expect(child!.path).toBe(grandChildCategory.expectedPath);
            });
          }
        },
      );
    });
    describe("when category doesn't exist", () => {
      it("should inform user category doesn't exist", async () => {
        const toUpdateCategory = {
          id: 123,
          name: "Bricollage",
          owner: "matos",
          parent: 2,
        };
        await expect(
          async () => await categoryManager.update(toUpdateCategory),
        ).rejects.toThrow(`La catégorie #${toUpdateCategory.id} n'existe pas`);
      });
    });
  });
  describe("get all categories", () => {
    beforeEach(() => {
      categoryRepository = new InMemoryCatalogCategories([
        BRICOLAGE_CATEGORY,
        ELECTRIQUE_CATEGORY,
        CABLE_CATEGORY,
        GROSSE_TENSION_CATEGORY,
      ]);
      teamRepository = new InMemoryCatalogTeams(OWNERS);
      categoryManager = new CatalogCategoryManager(
        categoryRepository,
        teamRepository,
      );
    });
    it(`should render categories as a parent tree
    - Matos
    - Electrique
        - Cable
          - Grosse Tension
    `, async () => {
      const categories = await categoryManager.getAll();
      expect(categories).toHaveLength(2);
      expect(categories).toContainEqual({
        id: BRICOLAGE_CATEGORY.id,
        name: BRICOLAGE_CATEGORY.name,
        path: BRICOLAGE_CATEGORY.path,
        owner: MATOS_OWNER,
        subCategories: [],
      });
      expect(categories).toContainEqual({
        id: ELECTRIQUE_CATEGORY.id,
        name: ELECTRIQUE_CATEGORY.name,
        path: ELECTRIQUE_CATEGORY.path,
        owner: ELEC_OWNER,
        subCategories: [
          {
            id: CABLE_CATEGORY.id,
            name: CABLE_CATEGORY.name,
            path: CABLE_CATEGORY.path,
            owner: ELEC_OWNER,
            parent: ELECTRIQUE_CATEGORY.id,
            subCategories: [
              {
                id: GROSSE_TENSION_CATEGORY.id,
                name: GROSSE_TENSION_CATEGORY.name,
                path: GROSSE_TENSION_CATEGORY.path,
                owner: ELEC_OWNER,
                parent: CABLE_CATEGORY.id,
                subCategories: [],
              },
            ],
          },
        ],
      });
    });
    describe("when there is more subcategories on a category", () => {
      beforeEach(() => {
        categoryRepository = new InMemoryCatalogCategories(
          getSignaCategories(),
        );
        teamRepository = new InMemoryCatalogTeams(OWNERS);
        categoryManager = new CatalogCategoryManager(
          categoryRepository,
          teamRepository,
        );
      });
      it(`should render signaletique category tree
        - Signaletique
          - Lumineuse
            - Projection
            - Panneau
          - Plan
            - Grand Format
            - Format flyer
          - Panneau
            - Bois
            - Plastique
            - Moquette
      `, async () => {
        const categories = await categoryManager.getAll();
        expect(categories).toHaveLength(1);
        expect(categories).toContainEqual({
          id: 1,
          name: "Signaletique",
          path: "signaletique",
          owner: SIGNA_OWNER,
          subCategories: [
            {
              id: 2,
              name: "Lumineuse",
              path: "signaletique->lumineuse",
              owner: SIGNA_OWNER,
              parent: 1,
              subCategories: [
                {
                  id: 3,
                  name: "Projection",
                  path: "signaletique->lumineuse->projection",
                  owner: SIGNA_OWNER,
                  parent: 2,
                  subCategories: [],
                },
                {
                  id: 10,
                  name: "Panneau",
                  path: "signaletique->lumineuse->panneau",
                  owner: SIGNA_OWNER,
                  parent: 2,
                  subCategories: [],
                },
              ],
            },
            {
              id: 4,
              name: "Plan",
              path: "signaletique->plan",
              owner: SIGNA_OWNER,
              parent: 1,
              subCategories: [
                {
                  id: 5,
                  name: "Grand Format",
                  path: "signaletique->plan->grand-format",
                  owner: SIGNA_OWNER,
                  parent: 4,
                  subCategories: [],
                },
                {
                  id: 6,
                  name: "Format Flyer",
                  path: "signaletique->plan->format-flyer",
                  owner: SIGNA_OWNER,
                  parent: 4,
                  subCategories: [],
                },
              ],
            },
            {
              id: 7,
              name: "Panneau",
              path: "signaletique->panneau",
              owner: SIGNA_OWNER,
              parent: 1,
              subCategories: [
                {
                  id: 8,
                  name: "Bois",
                  path: "signaletique->panneau->bois",
                  owner: SIGNA_OWNER,
                  parent: 7,
                  subCategories: [],
                },
                {
                  id: 8,
                  name: "Plastique",
                  path: "signaletique->panneau->plastique",
                  owner: SIGNA_OWNER,
                  parent: 7,
                  subCategories: [],
                },
                {
                  id: 9,
                  name: "Moquette",
                  path: "signaletique->panneau->moquette",
                  owner: SIGNA_OWNER,
                  parent: 7,
                  subCategories: [],
                },
              ],
            },
          ],
        });
      });
    });
  });
  describe("search a category", () => {
    describe.each`
      searchName   | searchOwner  | expectedCategories
      ${undefined} | ${undefined} | ${CATEGORIES}
      ${"bric"}    | ${undefined} | ${[BRICOLAGE_CATEGORY]}
      ${"elec"}    | ${undefined} | ${[ELECTRIQUE_CATEGORY]}
      ${"elec"}    | ${"matos"}   | ${[]}
      ${undefined} | ${"elec"}    | ${[ELECTRIQUE_CATEGORY, CABLE_CATEGORY, GROSSE_TENSION_CATEGORY]}
    `(
      'When looking for "$searchName" with "$searchOwner" owner',
      ({ searchName, searchOwner, expectedCategories }) => {
        it(`should retrieve ${expectedCategories.length} categories`, async () => {
          const categories = await categoryManager.search({
            name: searchName,
            owner: searchOwner,
          });
          expect(categories).toEqual(expectedCategories);
        });
      },
    );
  });
});

function getSignaCategories(): CatalogCategory[] {
  const owner = SIGNA_OWNER;
  return [
    { id: 1, name: "Signaletique", path: "signaletique", owner },
    {
      id: 2,
      name: "Lumineuse",
      path: "signaletique->lumineuse",
      owner,
      parent: 1,
    },
    {
      id: 3,
      name: "Projection",
      path: "signaletique->lumineuse->projection",
      owner,
      parent: 2,
    },
    {
      id: 10,
      name: "Panneau",
      path: "signaletique->lumineuse->panneau",
      owner,
      parent: 2,
    },
    { id: 4, name: "Plan", path: "signaletique->plan", owner, parent: 1 },
    {
      id: 5,
      name: "Grand Format",
      path: "signaletique->plan->grand-format",
      owner,
      parent: 4,
    },
    {
      id: 6,
      name: "Format Flyer",
      path: "signaletique->plan->format-flyer",
      owner,
      parent: 4,
    },
    { id: 7, name: "Panneau", path: "signaletique->panneau", owner, parent: 1 },
    {
      id: 8,
      name: "Bois",
      path: "signaletique->panneau->bois",
      owner,
      parent: 7,
    },
    {
      id: 8,
      name: "Plastique",
      path: "signaletique->panneau->plastique",
      owner,
      parent: 7,
    },
    {
      id: 9,
      name: "Moquette",
      path: "signaletique->panneau->moquette",
      owner,
      parent: 7,
    },
  ];
}
