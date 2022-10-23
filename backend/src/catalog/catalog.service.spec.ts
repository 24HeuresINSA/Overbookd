import { Category, Team } from './interfaces';
import {
  InMemoryCategoryRepository,
  InMemoryTeamRepository,
} from './repositories';
import { CatalogService } from './catalog.service';

const TEAMS: Team[] = [
  { id: 1, name: 'matos' },
  { id: 2, name: 'signa' },
  { id: 3, name: 'elec' },
];

const CATEGORIES: Category[] = [
  {
    id: 1,
    name: 'Bricollage',
    slug: 'bricollage',
    owner: { id: 1, name: 'matos' },
  },
  {
    id: 2,
    name: 'Electrique',
    slug: 'electrique',
    owner: { id: 3, name: 'elec' },
  },
  {
    id: 3,
    name: 'Cable',
    slug: 'electrique->cable',
    owner: { id: 3, name: 'elec' },
    parent: 2,
  },
  {
    id: 4,
    name: 'Grosse Tension',
    slug: 'electrique->cable->grosse-tension',
    owner: { id: 3, name: 'elec' },
    parent: 3,
  },
];

describe('Catalog', () => {
  const categoryRepository = new InMemoryCategoryRepository();
  const teamRepository = new InMemoryTeamRepository();
  const catalog = new CatalogService(categoryRepository, teamRepository);
  beforeEach(() => {
    categoryRepository.categories = [...CATEGORIES];
    teamRepository.teams = [...TEAMS];
  });
  describe('get category', () => {
    describe.each`
      categoryId | expectedCategory
      ${1}       | ${CATEGORIES[0]}
      ${2}       | ${CATEGORIES[1]}
      ${3}       | ${CATEGORIES[2]}
    `(
      'when category #$categoryId exists',
      ({ categoryId, expectedCategory }) => {
        it(`should retreive category #${categoryId} information`, async () => {
          const category = await catalog.find(categoryId);
          expect(category).toMatchObject(expectedCategory);
        });
      },
    );
    describe("when category doesn't exist", () => {
      const inexistantCategory = 5;
      it("should inform that category doesn't exist", async () => {
        await expect(
          async () => await catalog.find(inexistantCategory),
        ).rejects.toThrow(`Category #${inexistantCategory} doesn\'t exist`);
      });
    });
  });
  describe('create a category', () => {
    describe.each`
      name                    | expectedSlug
      ${'mobilier'}           | ${'mobilier'}
      ${'Mobilier'}           | ${'mobilier'}
      ${'prise secteur 400V'} | ${'prise-secteur-400v'}
    `(
      '$name main category without responsible team',
      ({ name, expectedSlug }) => {
        it(`should be created with generated id and "${expectedSlug}" as slug`, async () => {
          const createdCategory = await catalog.create({ name });
          expect(createdCategory).toHaveProperty('id');
          expect(createdCategory.id).toEqual(expect.any(Number));
          expect(createdCategory).toHaveProperty('name');
          expect(createdCategory.name).toBe(name);
          expect(createdCategory).toHaveProperty('slug');
          expect(createdCategory.slug).toBe(expectedSlug);
        });
        it(`should be accessible after`, async () => {
          const createdCategory = await catalog.create({ name });
          const fetchedCategory = await catalog.find(createdCategory.id);
          expect(createdCategory).toMatchObject(fetchedCategory);
        });
      },
    );
    describe.each`
      name                   | owner | expectedOwner
      ${'Outils'}            | ${1}  | ${{ name: 'matos', id: 1 }}
      ${'Panneaux Lumineux'} | ${2}  | ${{ name: 'signa', id: 2 }}
      ${'Cables'}            | ${3}  | ${{ name: 'elec', id: 3 }}
    `(
      '$name main category with #$owner owner team',
      ({ name, owner, expectedOwner }) => {
        it(`should associate ${name} category to ${expectedOwner.name} team`, async () => {
          const createdCategory = await catalog.create({ name, owner });
          expect(createdCategory.owner).toMatchObject(expectedOwner);
        });
      },
    );
    describe.each`
      name            | owner        | parentCategory | expectedSlug                | expectedOwner
      ${'Outils'}     | ${1}         | ${1}           | ${'bricollage->outils'}     | ${{ name: 'matos', id: 1 }}
      ${'Rangements'} | ${3}         | ${1}           | ${'bricollage->rangements'} | ${{ name: 'matos', id: 1 }}
      ${'Rallonges'}  | ${undefined} | ${2}           | ${'electrique->rallonges'}  | ${{ name: 'elec', id: 3 }}
    `(
      '$name sub category of #$parentCategory category',
      ({ name, owner, parentCategory, expectedSlug, expectedOwner }) => {
        it(`should generate composed ${expectedSlug} slug`, async () => {
          const createdCategory = await catalog.create({
            name,
            parent: parentCategory,
            owner,
          });
          expect(createdCategory.slug).toBe(expectedSlug);
        });
        it(`should be associated to #${parentCategory} category `, async () => {
          const createdCategory = await catalog.create({
            name,
            parent: parentCategory,
            owner,
          });
          expect(createdCategory.parent).toBe(parentCategory);
        });
        it(`should be associated to parent category ${expectedOwner.name} team`, async () => {
          const createdCategory = await catalog.create({
            name,
            parent: parentCategory,
            owner,
          });
          expect(createdCategory.owner).toMatchObject(expectedOwner);
        });
      },
    );
    describe("when parent category doesn't exist ", () => {
      const categoryName = 'Rangement';
      const inexistantParentCategory = 5;
      it("should inform the user parent category doesn't exist", async () => {
        await expect(
          async () =>
            await catalog.create({
              name: categoryName,
              parent: inexistantParentCategory,
            }),
        ).rejects.toThrow(
          `Category #${inexistantParentCategory} doesn\'t exist`,
        );
      });
    });
  });
  describe('delete a category', () => {
    describe.each`
      toDeleteCategory        | childrenCategory                                         | grandChildrenCategory
      ${{ id: 1 }}            | ${undefined}                                             | ${undefined}
      ${{ id: 4 }}            | ${undefined}                                             | ${undefined}
      ${{ id: 5 }}            | ${undefined}                                             | ${undefined}
      ${{ parent: 2, id: 3 }} | ${{ id: 4, expectedSlug: 'electrique->grosse-tension' }} | ${undefined}
      ${{ id: 2 }}            | ${{ id: 3, expectedSlug: 'cable' }}                      | ${{ id: 4, expectedSlug: 'cable->grosse-tension' }}
    `(
      `when deleting category $toDeleteCategory 
        with child category $childrenCategory
        with grandchild category $grandChildrenCategory`,
      ({ toDeleteCategory, childrenCategory, grandChildrenCategory }) => {
        it(`should not be possible to find #${toDeleteCategory.id} category after`, async () => {
          await catalog.remove(toDeleteCategory.id);
          await expect(async () => {
            await catalog.find(toDeleteCategory.id);
          }).rejects.toThrow(`Category #${toDeleteCategory.id} doesn't exist`);
        });
        if (childrenCategory) {
          it(`should link #${childrenCategory.id} child category to #${toDeleteCategory.parent} category`, async () => {
            await catalog.remove(toDeleteCategory.id);
            const child = await catalog.find(childrenCategory.id);
            expect(child.parent).not.toBe(toDeleteCategory.id);
            expect(child.parent).toBe(toDeleteCategory.parent);
          });
          it(`should change #${childrenCategory.id} child category slug to ${childrenCategory.expectedSlug}`, async () => {
            await catalog.remove(toDeleteCategory.id);
            const child = await catalog.find(childrenCategory.id);
            expect(child.slug).toBe(childrenCategory.expectedSlug);
          });
        }
        if (grandChildrenCategory) {
          it(`should change #${grandChildrenCategory.id} grandchild category slug to ${grandChildrenCategory.expectedSlug}`, async () => {
            await catalog.remove(toDeleteCategory.id);
            const grandChild = await catalog.find(grandChildrenCategory.id);
            expect(grandChild.slug).toBe(grandChildrenCategory.expectedSlug);
          });
        }
      },
    );
  });
  describe('update a category', () => {
    describe(`update category name
      - Update category slug according to new name
      - Cascade slug updates on sub categories
    `, () => {
      describe.each`
        toUpdateCategory                                                                       | expectedSlug                                  | childCategory                                                     | grandChildCategory
        ${{ id: 1, name: 'Bricolles', owner: { id: 1, name: 'matos' } }}                       | ${'bricolles'}                                | ${undefined}                                                      | ${undefined}
        ${{ id: 4, name: 'Mega Grosses Tensions', owner: { id: 3, name: 'elec' }, parent: 3 }} | ${'electrique->cable->mega-grosses-tensions'} | ${undefined}                                                      | ${undefined}
        ${{ id: 3, name: 'Cablage', owner: { id: 3, name: 'elec' }, parent: 2 }}               | ${'electrique->cablage'}                      | ${{ id: 4, expectedSlug: 'electrique->cablage->grosse-tension' }} | ${undefined}
        ${{ id: 2, name: 'Electricite', owner: { id: 3, name: 'elec' } }}                      | ${'electricite'}                              | ${{ id: 3, expectedSlug: 'electricite->cable' }}                  | ${{ id: 4, expectedSlug: 'electricite->cable->grosse-tension' }}
      `(
        `when update category #$toUpdateCategory.id name to "$toUpdateCategory.name"`,
        ({
          toUpdateCategory,
          expectedSlug,
          childCategory,
          grandChildCategory,
        }) => {
          it(`should update category slug to "${expectedSlug}"`, async () => {
            const updatedCategory = await catalog.update(toUpdateCategory);
            expect(updatedCategory.name).toBe(toUpdateCategory.name);
            expect(updatedCategory.slug).toBe(expectedSlug);
          });
          if (childCategory) {
            it(`should update #${childCategory.id} child category slug to ${childCategory.expectedSlug}`, async () => {
              await catalog.update(toUpdateCategory);
              const child = await catalog.find(childCategory.id);
              expect(child.slug).toBe(childCategory.expectedSlug);
            });
          }
          if (grandChildCategory) {
            it(`should update #${grandChildCategory.id} grandchild category slug to ${grandChildCategory.expectedSlug}`, async () => {
              await catalog.update(toUpdateCategory);
              const child = await catalog.find(grandChildCategory.id);
              expect(child.slug).toBe(grandChildCategory.expectedSlug);
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
        toUpdateCategory                                 | expectedOwner               | childCategory | grandChildCategory
        ${{ id: 1, name: 'Bricollage', owner: 2 }}       | ${{ id: 2, name: 'signa' }} | ${undefined}  | ${undefined}
        ${{ id: 3, name: 'Cable', owner: 2, parent: 2 }} | ${{ id: 3, name: 'elec' }}  | ${{ id: 3 }}  | ${undefined}
        ${{ id: 2, name: 'Electrique', owner: 2 }}       | ${{ id: 2, name: 'signa' }} | ${{ id: 3 }}  | ${{ id: 3 }}
      `(
        `when update category #$toUpdateCategory.id owner to #$toUpdateCategory.owner team`,
        ({
          toUpdateCategory,
          expectedOwner,
          childCategory,
          grandChildCategory,
        }) => {
          it(`should set category owner to "${expectedOwner.name}"`, async () => {
            const updatedCategory = await catalog.update(toUpdateCategory);
            expect(updatedCategory.owner).toMatchObject(expectedOwner);
          });
          if (childCategory) {
            it(`should set #${childCategory.id} child category owner to "${expectedOwner.name}"`, async () => {
              await catalog.update(toUpdateCategory);
              const child = await catalog.find(childCategory.id);
              expect(child.owner).toMatchObject(expectedOwner);
            });
          }
          if (grandChildCategory) {
            it(`should set #${grandChildCategory.id} grandchild category owner to "${expectedOwner.name}"`, async () => {
              await catalog.update(toUpdateCategory);
              const child = await catalog.find(grandChildCategory.id);
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
        toUpdateCategory                                      | expectedOwner               | expectedSlug                | childCategory                                               | grandChildCategory
        ${{ id: 1, name: 'Bricollage', owner: 1, parent: 2 }} | ${{ id: 3, name: 'elec' }}  | ${'electrique->bricollage'} | ${undefined}                                                | ${undefined}
        ${{ id: 4, name: 'Grosse Tension', owner: 3 }}        | ${{ id: 3, name: 'elec' }}  | ${'grosse-tension'}         | ${undefined}                                                | ${undefined}
        ${{ id: 2, name: 'Electrique', owner: 3, parent: 1 }} | ${{ id: 1, name: 'matos' }} | ${'bricollage->electrique'} | ${{ id: 3, expectedSlug: 'bricollage->electrique->cable' }} | ${{ id: 4, expectedSlug: 'bricollage->electrique->cable->grosse-tension' }}
      `(
        'when update #$toUpdateCategory.id category parent to #$toUpdateCategory.parent category',
        ({
          toUpdateCategory,
          expectedOwner,
          expectedSlug,
          childCategory,
          grandChildCategory,
        }) => {
          it(`should set category owner to "${expectedOwner.name}" team`, async () => {
            const updatedCategory = await catalog.update(toUpdateCategory);
            expect(updatedCategory.owner).toMatchObject(expectedOwner);
          });
          it(`should update category slug to "${expectedSlug}"`, async () => {
            const updatedCategory = await catalog.update(toUpdateCategory);
            expect(updatedCategory.name).toBe(toUpdateCategory.name);
            expect(updatedCategory.slug).toBe(expectedSlug);
          });
          if (childCategory) {
            it(`should set #${childCategory.id} child category owner to "${expectedOwner.name}"`, async () => {
              await catalog.update(toUpdateCategory);
              const child = await catalog.find(childCategory.id);
              expect(child.owner).toMatchObject(expectedOwner);
            });
            it(`should update #${childCategory.id} child category slug to ${childCategory.expectedSlug}`, async () => {
              await catalog.update(toUpdateCategory);
              const child = await catalog.find(childCategory.id);
              expect(child.slug).toBe(childCategory.expectedSlug);
            });
          }
          if (grandChildCategory) {
            it(`should set #${grandChildCategory.id} grandchild category owner to "${expectedOwner.name}"`, async () => {
              await catalog.update(toUpdateCategory);
              const child = await catalog.find(grandChildCategory.id);
              expect(child.owner).toMatchObject(expectedOwner);
            });
            it(`should update #${grandChildCategory.id} grandchild category slug to ${grandChildCategory.expectedSlug}`, async () => {
              await catalog.update(toUpdateCategory);
              const child = await catalog.find(grandChildCategory.id);
              expect(child.slug).toBe(grandChildCategory.expectedSlug);
            });
          }
        },
      );
    });
  });
});
