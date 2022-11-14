import { Category, Team } from './interfaces';
import {
  InMemoryCategoryRepository,
  InMemoryTeamRepository,
} from './repositories';
import { CategoryService } from './category.service';
import { SlugifyService } from '../common/services/slugify.service';

const teamMatos = { name: 'Orga Logistique Matos', slug: 'matos' };
const teamSigna = { name: 'Orga Signaletique', slug: 'signa' };
const teamElec = { name: 'Orga Logistique Electricite & Eau', slug: 'elec' };

const TEAMS: Team[] = [teamMatos, teamSigna, teamElec];

const CATEGORIES: Category[] = [
  {
    id: 1,
    name: 'Bricollage',
    slug: 'bricollage',
    owner: teamMatos,
  },
  {
    id: 2,
    name: 'Electrique',
    slug: 'electrique',
    owner: teamElec,
  },
  {
    id: 3,
    name: 'Cable',
    slug: 'electrique->cable',
    owner: teamElec,
    parent: 2,
  },
  {
    id: 4,
    name: 'Grosse Tension',
    slug: 'electrique->cable->grosse-tension',
    owner: teamElec,
    parent: 3,
  },
];

describe('Category', () => {
  const categoryRepository = new InMemoryCategoryRepository();
  const teamRepository = new InMemoryTeamRepository();
  const categService = new CategoryService(
    categoryRepository,
    teamRepository,
    new SlugifyService(),
  );
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
          const category = await categService.find(categoryId);
          expect(category).toMatchObject(expectedCategory);
        });
      },
    );
    describe("when category doesn't exist", () => {
      const inexistantCategory = 5;
      it("should inform that category doesn't exist", async () => {
        await expect(
          async () => await categService.find(inexistantCategory),
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
          const createdCategory = await categService.create({ name });
          expect(createdCategory).toHaveProperty('id');
          expect(createdCategory.id).toEqual(expect.any(Number));
          expect(createdCategory).toHaveProperty('name');
          expect(createdCategory.name).toBe(name);
          expect(createdCategory).toHaveProperty('slug');
          expect(createdCategory.slug).toBe(expectedSlug);
        });
        it(`should be accessible after`, async () => {
          const createdCategory = await categService.create({ name });
          const fetchedCategory = await categService.find(createdCategory.id);
          expect(createdCategory).toMatchObject(fetchedCategory);
        });
      },
    );
    describe.each`
      name                   | owner      | expectedOwner
      ${'Outils'}            | ${'matos'} | ${teamMatos}
      ${'Panneaux Lumineux'} | ${'signa'} | ${teamSigna}
      ${'Cables'}            | ${'elec'}  | ${teamElec}
    `(
      '$name main category with #$owner owner team',
      ({ name, owner, expectedOwner }) => {
        it(`should associate ${name} category to ${expectedOwner.name} team`, async () => {
          const createdCategory = await categService.create({ name, owner });
          expect(createdCategory.owner).toMatchObject(expectedOwner);
        });
      },
    );
    describe.each`
      name            | owner        | parentCategory | expectedSlug                | expectedOwner
      ${'Outils'}     | ${'matos'}   | ${1}           | ${'bricollage->outils'}     | ${teamMatos}
      ${'Rangements'} | ${'elec'}    | ${1}           | ${'bricollage->rangements'} | ${teamMatos}
      ${'Rallonges'}  | ${undefined} | ${2}           | ${'electrique->rallonges'}  | ${teamElec}
    `(
      '$name sub category of #$parentCategory category',
      ({ name, owner, parentCategory, expectedSlug, expectedOwner }) => {
        it(`should generate composed ${expectedSlug} slug`, async () => {
          const createdCategory = await categService.create({
            name,
            parent: parentCategory,
            owner,
          });
          expect(createdCategory.slug).toBe(expectedSlug);
        });
        it(`should be associated to #${parentCategory} category `, async () => {
          const createdCategory = await categService.create({
            name,
            parent: parentCategory,
            owner,
          });
          expect(createdCategory.parent).toBe(parentCategory);
        });
        it(`should be associated to parent category ${expectedOwner.name} team`, async () => {
          const createdCategory = await categService.create({
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
            await categService.create({
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
          await categService.remove(toDeleteCategory.id);
          await expect(async () => {
            await categService.find(toDeleteCategory.id);
          }).rejects.toThrow(`Category #${toDeleteCategory.id} doesn't exist`);
        });
        if (childrenCategory) {
          it(`should link #${childrenCategory.id} child category to #${toDeleteCategory.parent} category`, async () => {
            await categService.remove(toDeleteCategory.id);
            const child = await categService.find(childrenCategory.id);
            expect(child.parent).not.toBe(toDeleteCategory.id);
            expect(child.parent).toBe(toDeleteCategory.parent);
          });
          it(`should change #${childrenCategory.id} child category slug to ${childrenCategory.expectedSlug}`, async () => {
            await categService.remove(toDeleteCategory.id);
            const child = await categService.find(childrenCategory.id);
            expect(child.slug).toBe(childrenCategory.expectedSlug);
          });
        }
        if (grandChildrenCategory) {
          it(`should change #${grandChildrenCategory.id} grandchild category slug to ${grandChildrenCategory.expectedSlug}`, async () => {
            await categService.remove(toDeleteCategory.id);
            const grandChild = await categService.find(
              grandChildrenCategory.id,
            );
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
            const updatedCategory = await categService.update(toUpdateCategory);
            expect(updatedCategory.name).toBe(toUpdateCategory.name);
            expect(updatedCategory.slug).toBe(expectedSlug);
          });
          if (childCategory) {
            it(`should update #${childCategory.id} child category slug to ${childCategory.expectedSlug}`, async () => {
              await categService.update(toUpdateCategory);
              const child = await categService.find(childCategory.id);
              expect(child.slug).toBe(childCategory.expectedSlug);
            });
          }
          if (grandChildCategory) {
            it(`should update #${grandChildCategory.id} grandchild category slug to ${grandChildCategory.expectedSlug}`, async () => {
              await categService.update(toUpdateCategory);
              const child = await categService.find(grandChildCategory.id);
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
        toUpdateCategory                                       | expectedOwner | childCategory | grandChildCategory
        ${{ id: 1, name: 'Bricollage', owner: 'signa' }}       | ${teamSigna}  | ${undefined}  | ${undefined}
        ${{ id: 3, name: 'Cable', owner: 'signa', parent: 2 }} | ${teamElec}   | ${{ id: 3 }}  | ${undefined}
        ${{ id: 2, name: 'Electrique', owner: 'signa' }}       | ${teamSigna}  | ${{ id: 3 }}  | ${{ id: 3 }}
      `(
        `when update category #$toUpdateCategory.id owner to #$toUpdateCategory.owner team`,
        ({
          toUpdateCategory,
          expectedOwner,
          childCategory,
          grandChildCategory,
        }) => {
          it(`should set category owner to "${expectedOwner.name}"`, async () => {
            const updatedCategory = await categService.update(toUpdateCategory);
            expect(updatedCategory.owner).toMatchObject(expectedOwner);
          });
          if (childCategory) {
            it(`should set #${childCategory.id} child category owner to "${expectedOwner.name}"`, async () => {
              await categService.update(toUpdateCategory);
              const child = await categService.find(childCategory.id);
              expect(child.owner).toMatchObject(expectedOwner);
            });
          }
          if (grandChildCategory) {
            it(`should set #${grandChildCategory.id} grandchild category owner to "${expectedOwner.name}"`, async () => {
              await categService.update(toUpdateCategory);
              const child = await categService.find(grandChildCategory.id);
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
        toUpdateCategory                                            | expectedOwner | expectedSlug                | childCategory                                               | grandChildCategory
        ${{ id: 1, name: 'Bricollage', owner: 'matos', parent: 2 }} | ${teamElec}   | ${'electrique->bricollage'} | ${undefined}                                                | ${undefined}
        ${{ id: 4, name: 'Grosse Tension', owner: 'elec' }}         | ${teamElec}   | ${'grosse-tension'}         | ${undefined}                                                | ${undefined}
        ${{ id: 2, name: 'Electrique', owner: 'elec', parent: 1 }}  | ${teamMatos}  | ${'bricollage->electrique'} | ${{ id: 3, expectedSlug: 'bricollage->electrique->cable' }} | ${{ id: 4, expectedSlug: 'bricollage->electrique->cable->grosse-tension' }}
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
            const updatedCategory = await categService.update(toUpdateCategory);
            expect(updatedCategory.owner).toMatchObject(expectedOwner);
          });
          it(`should update category slug to "${expectedSlug}"`, async () => {
            const updatedCategory = await categService.update(toUpdateCategory);
            expect(updatedCategory.name).toBe(toUpdateCategory.name);
            expect(updatedCategory.slug).toBe(expectedSlug);
          });
          if (childCategory) {
            it(`should set #${childCategory.id} child category owner to "${expectedOwner.name}"`, async () => {
              await categService.update(toUpdateCategory);
              const child = await categService.find(childCategory.id);
              expect(child.owner).toMatchObject(expectedOwner);
            });
            it(`should update #${childCategory.id} child category slug to ${childCategory.expectedSlug}`, async () => {
              await categService.update(toUpdateCategory);
              const child = await categService.find(childCategory.id);
              expect(child.slug).toBe(childCategory.expectedSlug);
            });
          }
          if (grandChildCategory) {
            it(`should set #${grandChildCategory.id} grandchild category owner to "${expectedOwner.name}"`, async () => {
              await categService.update(toUpdateCategory);
              const child = await categService.find(grandChildCategory.id);
              expect(child.owner).toMatchObject(expectedOwner);
            });
            it(`should update #${grandChildCategory.id} grandchild category slug to ${grandChildCategory.expectedSlug}`, async () => {
              await categService.update(toUpdateCategory);
              const child = await categService.find(grandChildCategory.id);
              expect(child.slug).toBe(grandChildCategory.expectedSlug);
            });
          }
        },
      );
    });
    describe("when category doesn't exist", () => {
      it("should inform user category doesn't exist", async () => {
        const toUpdateCategory = {
          id: 123,
          name: 'Bricollage',
          owner: 'matos',
          parent: 2,
        };
        await expect(
          async () => await categService.update(toUpdateCategory),
        ).rejects.toThrow(`Category #${toUpdateCategory.id} doesn\'t exist`);
      });
    });
  });
  describe('get all categories', () => {
    it(`should render categories as a parent tree
    - Matos
    - Electrique
        - Cable
          - Grosse Tension
    `, async () => {
      const categories = await categService.getAll();
      expect(categories).toHaveLength(2);
      expect(categories).toContainEqual({
        id: 1,
        name: 'Bricollage',
        slug: 'bricollage',
        owner: teamMatos,
        subCategories: [],
      });
      expect(categories).toContainEqual({
        id: 2,
        name: 'Electrique',
        slug: 'electrique',
        owner: teamElec,
        subCategories: [
          {
            id: 3,
            name: 'Cable',
            slug: 'electrique->cable',
            owner: teamElec,
            parent: 2,
            subCategories: [
              {
                id: 4,
                name: 'Grosse Tension',
                slug: 'electrique->cable->grosse-tension',
                owner: teamElec,
                parent: 3,
                subCategories: [],
              },
            ],
          },
        ],
      });
    });
    describe('when there is more subcategories on a category', () => {
      beforeEach(() => {
        categoryRepository.categories = getSignaCategories();
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
        const categories = await categService.getAll();
        expect(categories).toHaveLength(1);
        expect(categories).toContainEqual({
          id: 1,
          name: 'Signaletique',
          slug: 'signaletique',
          owner: teamSigna,
          subCategories: [
            {
              id: 2,
              name: 'Lumineuse',
              slug: 'signaletique->lumineuse',
              owner: teamSigna,
              parent: 1,
              subCategories: [
                {
                  id: 3,
                  name: 'Projection',
                  slug: 'signaletique->lumineuse->projection',
                  owner: teamSigna,
                  parent: 2,
                  subCategories: [],
                },
                {
                  id: 10,
                  name: 'Panneau',
                  slug: 'signaletique->lumineuse->panneau',
                  owner: teamSigna,
                  parent: 2,
                  subCategories: [],
                },
              ],
            },
            {
              id: 4,
              name: 'Plan',
              slug: 'signaletique->plan',
              owner: teamSigna,
              parent: 1,
              subCategories: [
                {
                  id: 5,
                  name: 'Grand Format',
                  slug: 'signaletique->plan->grand-format',
                  owner: teamSigna,
                  parent: 4,
                  subCategories: [],
                },
                {
                  id: 6,
                  name: 'Format Flyer',
                  slug: 'signaletique->plan->format-flyer',
                  owner: teamSigna,
                  parent: 4,
                  subCategories: [],
                },
              ],
            },
            {
              id: 7,
              name: 'Panneau',
              slug: 'signaletique->panneau',
              owner: teamSigna,
              parent: 1,
              subCategories: [
                {
                  id: 8,
                  name: 'Bois',
                  slug: 'signaletique->panneau->bois',
                  owner: teamSigna,
                  parent: 7,
                  subCategories: [],
                },
                {
                  id: 8,
                  name: 'Plastique',
                  slug: 'signaletique->panneau->plastique',
                  owner: teamSigna,
                  parent: 7,
                  subCategories: [],
                },
                {
                  id: 9,
                  name: 'Moquette',
                  slug: 'signaletique->panneau->moquette',
                  owner: teamSigna,
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
  describe('search a category', () => {
    describe.each`
      searchName   | searchOwner  | expectedCategories
      ${undefined} | ${undefined} | ${CATEGORIES}
      ${'bric'}    | ${undefined} | ${[CATEGORIES[0]]}
      ${'elec'}    | ${undefined} | ${[CATEGORIES[1]]}
      ${'elec'}    | ${'matos'}   | ${[]}
      ${undefined} | ${'elec'}    | ${[CATEGORIES[1], CATEGORIES[2], CATEGORIES[3]]}
    `(
      'When looking for "$searchName" with "$searchOwner" owner',
      ({ searchName, searchOwner, expectedCategories }) => {
        it(`should retrieve ${expectedCategories.length} categories`, async () => {
          const categories = await categService.search({
            name: searchName,
            owner: searchOwner,
          });
          expect(categories).toEqual(expectedCategories);
        });
      },
    );
  });
});

function getSignaCategories(): Category[] {
  const owner = teamSigna;
  return [
    { id: 1, name: 'Signaletique', slug: 'signaletique', owner },
    {
      id: 2,
      name: 'Lumineuse',
      slug: 'signaletique->lumineuse',
      owner,
      parent: 1,
    },
    {
      id: 3,
      name: 'Projection',
      slug: 'signaletique->lumineuse->projection',
      owner,
      parent: 2,
    },
    {
      id: 10,
      name: 'Panneau',
      slug: 'signaletique->lumineuse->panneau',
      owner,
      parent: 2,
    },
    { id: 4, name: 'Plan', slug: 'signaletique->plan', owner, parent: 1 },
    {
      id: 5,
      name: 'Grand Format',
      slug: 'signaletique->plan->grand-format',
      owner,
      parent: 4,
    },
    {
      id: 6,
      name: 'Format Flyer',
      slug: 'signaletique->plan->format-flyer',
      owner,
      parent: 4,
    },
    { id: 7, name: 'Panneau', slug: 'signaletique->panneau', owner, parent: 1 },
    {
      id: 8,
      name: 'Bois',
      slug: 'signaletique->panneau->bois',
      owner,
      parent: 7,
    },
    {
      id: 8,
      name: 'Plastique',
      slug: 'signaletique->panneau->plastique',
      owner,
      parent: 7,
    },
    {
      id: 9,
      name: 'Moquette',
      slug: 'signaletique->panneau->moquette',
      owner,
      parent: 7,
    },
  ];
}
