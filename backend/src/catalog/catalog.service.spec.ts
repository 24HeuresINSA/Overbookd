import { SlugifyService } from '../common/services/slugify.service';
import { CatalogService } from './catalog.service';
import { Category, Gear } from './interfaces';
import {
  InMemoryCategoryRepository,
  InMemoryGearRepository,
} from './repositories';

const teamMatos = { name: 'Orga Logistique Matos', slug: 'matos' };
const teamBarriere = { name: 'Orga Logistique et Securite', slug: 'barrieres' };

const CATEGORIES: Category[] = [
  {
    id: 1,
    name: 'Bricollage',
    slug: 'bricollage',
    owner: teamMatos,
  },
  {
    id: 2,
    name: 'Outils',
    slug: 'bricollage->outils',
    owner: teamMatos,
    parent: 1,
  },
  {
    id: 3,
    name: 'Mobilier',
    slug: 'mobilier',
    owner: teamMatos,
  },
  {
    id: 4,
    name: 'Divers',
    slug: 'divers',
  },
  {
    id: 5,
    name: 'Barrieres',
    slug: 'barrieres',
    owner: teamBarriere,
  },
];

const GEARS: Gear[] = [
  {
    id: 1,
    name: 'Perceuse',
    slug: 'perceuse',
    category: {
      id: CATEGORIES[1].id,
      slug: CATEGORIES[1].slug,
      name: CATEGORIES[1].name,
    },
    owner: teamMatos,
  },
  {
    id: 2,
    name: 'Chaise',
    slug: 'chaise',
    category: {
      id: CATEGORIES[2].id,
      slug: CATEGORIES[2].slug,
      name: CATEGORIES[2].name,
    },
    owner: teamMatos,
  },
  {
    id: 3,
    name: 'Tireuse',
    slug: 'tireuse',
  },
];

const SIMILAR_GEARS: Gear[] = [
  ...GEARS,
  {
    id: 4,
    name: 'Tablier',
    slug: 'tablier',
  },
  {
    id: 5,
    name: 'Ponçeuse',
    slug: 'ponceuse',
    category: {
      id: CATEGORIES[1].id,
      slug: CATEGORIES[1].slug,
      name: CATEGORIES[1].name,
    },
    owner: teamMatos,
  },
  {
    id: 6,
    name: 'Table',
    slug: 'table',
    category: {
      id: CATEGORIES[2].id,
      slug: CATEGORIES[2].slug,
      name: CATEGORIES[2].name,
    },
    owner: teamMatos,
  },
];

describe('Catalog', () => {
  const categoryRepository = new InMemoryCategoryRepository();
  const gearRepository = new InMemoryGearRepository();
  const catalog = new CatalogService(
    new SlugifyService(),
    categoryRepository,
    gearRepository,
  );
  beforeAll(() => {
    categoryRepository.categories = CATEGORIES;
    gearRepository.gears = GEARS;
  });
  describe('Get gear', () => {
    describe.each`
      gearId | expectedGear
      ${1}   | ${GEARS[0]}
      ${2}   | ${GEARS[1]}
      ${3}   | ${GEARS[2]}
    `('When #$gearId gear exists', ({ gearId, expectedGear }) => {
      it(`should retrieve #${gearId} gear information`, async () => {
        const gear = await catalog.find(gearId);
        expect(gear).toEqual(expectedGear);
      });
    });
    describe("When gear doesn't exist", () => {
      it("should inform the user gear doesn't exist", async () => {
        await expect(async () => await catalog.find(123)).rejects.toThrow(
          `Gear #${123} doesn\'t exist`,
        );
      });
    });
  });
  describe('Add gear', () => {
    describe.each`
      name               | category     | expectedSlug       | expectedCategory                                         | expectedOwner
      ${'Marteau'}       | ${2}         | ${'marteau'}       | ${{ id: 2, name: 'Outils', slug: 'bricollage->outils' }} | ${{ name: teamMatos.name, slug: teamMatos.slug }}
      ${'Scie Sauteuse'} | ${2}         | ${'scie-sauteuse'} | ${{ id: 2, name: 'Outils', slug: 'bricollage->outils' }} | ${{ name: teamMatos.name, slug: teamMatos.slug }}
      ${'Table'}         | ${3}         | ${'table'}         | ${{ id: 3, name: 'Mobilier', slug: 'mobilier' }}         | ${{ name: teamMatos.name, slug: teamMatos.slug }}
      ${'Des'}           | ${undefined} | ${'des'}           | ${undefined}                                             | ${undefined}
      ${'Gants'}         | ${4}         | ${'gants'}         | ${{ id: 4, name: 'Divers', slug: 'divers' }}             | ${undefined}
      ${'Vauban'}        | ${5}         | ${'vauban'}        | ${{ id: 5, name: 'Barrieres', slug: 'barrieres' }}       | ${{ name: teamBarriere.name, slug: teamBarriere.slug }}
    `(
      'Add gear "$name" with #$category category to catalog',
      ({ name, category, expectedSlug, expectedCategory, expectedOwner }) => {
        let gear: Gear;
        afterAll(() => {
          gearRepository.gears = GEARS;
        });
        beforeAll(async () => {
          gear = await catalog.add({ name, category });
        });
        it(`should create gear ${name} with generated id and slug "${expectedSlug}"`, async () => {
          expect(gear).toHaveProperty('id');
          expect(gear.id).toEqual(expect.any(Number));
          expect(gear.name).toBe(name);
          expect(gear.slug).toBe(expectedSlug);
        });
        if (expectedCategory) {
          it(`should link gear ${name} to category "${expectedCategory.name}"`, async () => {
            expect(gear.category).toEqual(expectedCategory);
          });
        }
        if (expectedOwner) {
          it(`should link gear ${name} to team "${expectedOwner.name}"`, async () => {
            expect(gear.owner).toEqual(expectedOwner);
          });
        }
        it(`should be accessible after`, async () => {
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
              name: 'Random',
              category: 123,
            }),
        ).rejects.toThrow(`Category #${123} doesn\'t exist`);
      });
    });
    describe('When a similar gear already exist (i.e. slug are the same)', () => {
      it('should inform user a similar gear already exists', async () => {
        await expect(
          async () =>
            await catalog.add({
              name: 'Perçeuse',
              category: 2,
            }),
        ).rejects.toThrow(`"Perceuse" gear already exist`);
      });
    });
  });
  describe('Update gear', () => {
    describe.each`
      toUpdateGear                                      | expectedSlug        | expectedCategory
      ${{ id: 1, name: 'Perceuse à vis', category: 2 }} | ${'perceuse-a-vis'} | ${{ id: 2, name: 'Outils', slug: 'bricollage->outils' }}
      ${{ id: 3, name: 'Tireuse', category: 3 }}        | ${'tireuse'}        | ${{ id: 3, name: 'Mobilier', slug: 'mobilier' }}
      ${{ id: 2, name: 'Transat' }}                     | ${'transat'}        | ${undefined}
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
        it('should persist update', async () => {
          await catalog.update(toUpdateGear);
          const updatedGear = await catalog.find(toUpdateGear.id);
          expect(updatedGear).toEqual({
            ...toUpdateGear,
            slug: expectedSlug,
            category: expectedCategory,
          });
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
          async () => await catalog.update({ id: 123, name: 'Lavabo' }),
        ).rejects.toThrow(`Gear #${123} doesn\'t exist`);
      });
    });
  });
  describe('Delete gear', () => {
    describe.each`
      toDeleteGearId
      ${1}
      ${3}
      ${123}
    `('Delete #$toDeleteGearId gear', ({ toDeleteGearId }) => {
      it(`should remove #${toDeleteGearId} gear from persistance`, async () => {
        await catalog.remove(toDeleteGearId);
        await expect(
          async () => await catalog.find(toDeleteGearId),
        ).rejects.toThrow(`Gear #${toDeleteGearId} doesn\'t exist`);
      });
    });
  });
  describe('Search gear', () => {
    beforeAll(() => {
      gearRepository.gears = SIMILAR_GEARS;
    });
    afterAll(() => {
      gearRepository.gears = GEARS;
    });
    describe.each`
      searchName   | searchCategory  | searchOwner  | expectedGears
      ${'TAblIer'} | ${undefined}    | ${undefined} | ${[SIMILAR_GEARS[3]]}
      ${'TAblI'}   | ${undefined}    | ${undefined} | ${[SIMILAR_GEARS[3]]}
      ${'TAbl'}    | ${undefined}    | ${undefined} | ${[SIMILAR_GEARS[3], SIMILAR_GEARS[5]]}
      ${'TAblI'}   | ${'Mobilier'}   | ${undefined} | ${[]}
      ${'euse'}    | ${undefined}    | ${undefined} | ${[SIMILAR_GEARS[0], SIMILAR_GEARS[2], SIMILAR_GEARS[4]]}
      ${'euse'}    | ${'BricolLage'} | ${undefined} | ${[SIMILAR_GEARS[0], SIMILAR_GEARS[4]]}
      ${undefined} | ${undefined}    | ${'Matos'}   | ${[SIMILAR_GEARS[0], SIMILAR_GEARS[1], SIMILAR_GEARS[4], SIMILAR_GEARS[5]]}
      ${undefined} | ${undefined}    | ${'maT'}     | ${[SIMILAR_GEARS[0], SIMILAR_GEARS[1], SIMILAR_GEARS[4], SIMILAR_GEARS[5]]}
      ${'tab'}     | ${undefined}    | ${'maT'}     | ${[SIMILAR_GEARS[5]]}
      ${'tab'}     | ${'Brico'}      | ${'maT'}     | ${[]}
    `(
      'When looking for "$searchName" in $searchCategory category with $searchOwner owner',
      ({ searchName, searchCategory, searchOwner, expectedGears }) => {
        it(`should retrieve ${expectedGears.length} gears`, async () => {
          const gears = await catalog.search({
            name: searchName,
            category: searchCategory,
            owner: searchOwner,
          });
          expect(gears).toEqual(expectedGears);
        });
      },
    );
  });
  describe('Get all gears', () => {
    it('should retriece all gears', async () => {
      const gears = await catalog.getAll();
      expect(gears).toEqual(GEARS);
    });
  });
});
