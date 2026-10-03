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
    categoryRepository = new InMemoryCatalogCategories([...CATEGORIES]);
    teamRepository = new InMemoryCatalogTeams([...OWNERS]);
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
      ${"mobilier"}           | ${"mobilier"}
      ${"Mobilier"}           | ${"mobilier"}
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
          const fetchedCategory = await categoryManager.find(
            createdCategory.id,
          );
          expect(createdCategory).toMatchObject(fetchedCategory);
        });
      },
    );
    describe.each`
      name                   | owner      | expectedOwner
      ${"Outils"}            | ${"matos"} | ${MATOS_OWNER}
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
      name            | owner        | parentCategory            | expectedPath                | expectedOwner
      ${"Outils"}     | ${"matos"}   | ${BRICOLAGE_CATEGORY.id}  | ${"bricollage->outils"}     | ${MATOS_OWNER}
      ${"Rangements"} | ${"elec"}    | ${BRICOLAGE_CATEGORY.id}  | ${"bricollage->rangements"} | ${ELEC_OWNER}
      ${"Rallonges"}  | ${undefined} | ${ELECTRIQUE_CATEGORY.id} | ${"electrique->rallonges"}  | ${ELEC_OWNER}
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
      const inexistantParentCategory = 5;
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
        const name = CATEGORIES[0].name.toUpperCase();
        await expect(
          async () =>
            await categoryManager.create({
              name,
            }),
        ).rejects.toThrow(`"${CATEGORIES[0].name}" category already exist`);
      });
    });
  });
  describe("delete a category", () => {
    describe.each`
      toDeleteCategory       | childrenCategory           | grandChildrenCategory
      ${BRICOLAGE_CATEGORY}  | ${undefined}               | ${undefined}
      ${DIVERS_CATEGORY}     | ${undefined}               | ${undefined}
      ${CABLE_CATEGORY}      | ${GROSSE_TENSION_CATEGORY} | ${undefined}
      ${ELECTRIQUE_CATEGORY} | ${CABLE_CATEGORY}          | ${GROSSE_TENSION_CATEGORY}
    `(
      `when deleting category $toDeleteCategory
        with child category $childrenCategory
        with grandchild category $grandChildrenCategory`,
      ({ toDeleteCategory, childrenCategory, grandChildrenCategory }) => {
        it(`should not be possible to find #${toDeleteCategory.id} category after`, async () => {
          await categoryManager.remove(toDeleteCategory.id);
          await expect(async () => {
            await categoryManager.find(toDeleteCategory.id);
          }).rejects.toThrow(
            `La catégorie #${toDeleteCategory.id} n'existe pas`,
          );
        });
        if (childrenCategory) {
          it(`should link #${childrenCategory.id} child category to #${toDeleteCategory.parent} category`, async () => {
            await categoryManager.remove(toDeleteCategory.id);
            const child = await categoryManager.find(childrenCategory.id);
            expect(child.parent).not.toBe(toDeleteCategory.id);
            expect(child.parent).toBe(toDeleteCategory.parent);
          });
          it(`should change #${childrenCategory.id} child category path to ${childrenCategory.expectedPath}`, async () => {
            await categoryManager.remove(toDeleteCategory.id);
            const child = await categoryManager.find(childrenCategory.id);
            expect(child.path).toBe(childrenCategory.expectedPath);
          });
        }
        if (grandChildrenCategory) {
          it(`should change #${grandChildrenCategory.id} grandchild category path to ${grandChildrenCategory.expectedPath}`, async () => {
            await categoryManager.remove(toDeleteCategory.id);
            const grandChild = await categoryManager.find(
              grandChildrenCategory.id,
            );
            expect(grandChild.path).toBe(grandChildrenCategory.expectedPath);
          });
        }
      },
    );
  });
  describe("update a category", () => {
    describe(`update category name
      - Update category slug according to new name
      - Cascade slug updates on sub categories
    `, () => {
      describe.each`
        toUpdateCategory                                                                       | expectedPath                                  | childCategory                                                     | grandChildCategory
        ${{ id: 1, name: "Bricolles", owner: { id: 1, name: "matos" } }}                       | ${"bricolles"}                                | ${undefined}                                                      | ${undefined}
        ${{ id: 4, name: "Mega Grosses Tensions", owner: { id: 3, name: "elec" }, parent: 3 }} | ${"electrique->cable->mega-grosses-tensions"} | ${undefined}                                                      | ${undefined}
        ${{ id: 3, name: "Cablage", owner: { id: 3, name: "elec" }, parent: 2 }}               | ${"electrique->cablage"}                      | ${{ id: 4, expectedPath: "electrique->cablage->grosse-tension" }} | ${undefined}
        ${{ id: 2, name: "Electricite", owner: { id: 3, name: "elec" } }}                      | ${"electricite"}                              | ${{ id: 3, expectedPath: "electricite->cable" }}                  | ${{ id: 4, expectedPath: "electricite->cable->grosse-tension" }}
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
              const child = await categoryManager.find(childCategory.id);
              expect(child.path).toBe(childCategory.expectedPath);
            });
          }
          if (grandChildCategory) {
            it(`should update #${grandChildCategory.id} grandchild category path to ${grandChildCategory.expectedPath}`, async () => {
              await categoryManager.update(toUpdateCategory);
              const child = await categoryManager.find(grandChildCategory.id);
              expect(child.path).toBe(grandChildCategory.expectedPath);
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
        toUpdateCategory                                       | expectedOwner  | childCategory | grandChildCategory
        ${{ id: 1, name: "Bricollage", owner: "signa" }}       | ${SIGNA_OWNER} | ${undefined}  | ${undefined}
        ${{ id: 3, name: "Cable", owner: "signa", parent: 2 }} | ${ELEC_OWNER}  | ${{ id: 3 }}  | ${undefined}
        ${{ id: 2, name: "Electrique", owner: "signa" }}       | ${SIGNA_OWNER} | ${{ id: 3 }}  | ${{ id: 3 }}
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
              const child = await categoryManager.find(childCategory.id);
              expect(child.owner).toMatchObject(expectedOwner);
            });
          }
          if (grandChildCategory) {
            it(`should set #${grandChildCategory.id} grandchild category owner to "${expectedOwner.name}"`, async () => {
              await categoryManager.update(toUpdateCategory);
              const child = await categoryManager.find(grandChildCategory.id);
              expect(child.owner).toMatchObject(expectedOwner);
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
        toUpdateCategory                                        | expectedOwner  | expectedPath           | childCategory              | grandChildCategory
        ${{ ...OUTILS_CATEGORY, parent: MOBILIER_CATEGORY.id }} | ${MATOS_OWNER} | ${"mobilier->outils"}  | ${undefined}               | ${undefined}
        ${{ ...CABLE_CATEGORY, parent: undefined }}             | ${ELEC_OWNER}  | ${"cable"}             | ${GROSSE_TENSION_CATEGORY} | ${undefined}
        ${{ ...CABLE_CATEGORY, parent: BRICOLAGE_CATEGORY.id }} | ${MATOS_OWNER} | ${"bricollage->cable"}
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
              const child = await categoryManager.find(childCategory.id);
              expect(child.owner).toMatchObject(expectedOwner);
            });
            it(`should update #${childCategory.id} child category path to ${childCategory.expectedPath}`, async () => {
              await categoryManager.update(toUpdateCategory);
              const child = await categoryManager.find(childCategory.id);
              expect(child.path).toBe(childCategory.expectedPath);
            });
          }
          if (grandChildCategory) {
            it(`should set #${grandChildCategory.id} grandchild category owner to "${expectedOwner.name}"`, async () => {
              await categoryManager.update(toUpdateCategory);
              const child = await categoryManager.find(grandChildCategory.id);
              expect(child.owner).toMatchObject(expectedOwner);
            });
            it(`should update #${grandChildCategory.id} grandchild category path to ${grandChildCategory.expectedPath}`, async () => {
              await categoryManager.update(toUpdateCategory);
              const child = await categoryManager.find(grandChildCategory.id);
              expect(child.path).toBe(grandChildCategory.expectedPath);
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
      ${"bric"}    | ${undefined} | ${[CATEGORIES[0]]}
      ${"elec"}    | ${undefined} | ${[CATEGORIES[1]]}
      ${"elec"}    | ${"matos"}   | ${[]}
      ${undefined} | ${"elec"}    | ${[CATEGORIES[1], CATEGORIES[2], CATEGORIES[3]]}
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
