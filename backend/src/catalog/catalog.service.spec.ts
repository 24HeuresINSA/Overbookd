import { SlugifyService } from '../common/services/slugify.service';
import { CatalogService } from './catalog.service';
import { Category, Gear } from './interfaces';
import {
  InMemoryCategoryRepository,
  InMemoryGearRepository,
} from './repositories/in-memory';

const teamMatos = { name: 'Orga Logistique Matos', code: 'matos' };
const teamBarriere = { name: 'Orga Logistique et Securite', code: 'barrieres' };

const CATEGORIES: Category[] = [
  {
    id: 1,
    name: 'Bricollage',
    path: 'bricollage',
    owner: teamMatos,
  },
  {
    id: 2,
    name: 'Outils',
    path: 'bricollage->outils',
    owner: teamMatos,
    parent: 1,
  },
  {
    id: 3,
    name: 'Mobilier',
    path: 'mobilier',
    owner: teamMatos,
  },
  {
    id: 4,
    name: 'Divers',
    path: 'divers',
  },
  {
    id: 5,
    name: 'Barrieres',
    path: 'barrieres',
    owner: teamBarriere,
  },
];

const PERCEUSE: Gear = {
  id: 1,
  name: 'Perceuse',
  slug: 'perceuse',
  category: {
    id: CATEGORIES[1].id,
    path: CATEGORIES[1].path,
    name: CATEGORIES[1].name,
  },
  owner: teamMatos,
  code: 'BR_OU_001',
  isPonctualUsage: true,
};

const GEARS: Gear[] = [
  PERCEUSE,
  {
    id: 2,
    name: 'Chaise',
    slug: 'chaise',
    category: {
      id: CATEGORIES[2].id,
      path: CATEGORIES[2].path,
      name: CATEGORIES[2].name,
    },
    owner: teamMatos,
    code: 'MO_002',
    isPonctualUsage: false,
  },
  {
    id: 3,
    name: 'Tireuse',
    slug: 'tireuse',
    isPonctualUsage: false,
  },
];

const TABLIER: Gear = {
  id: 4,
  name: 'Tablier',
  slug: 'tablier',
  isPonctualUsage: true,
};

const PONCEUSE: Gear = {
  id: 5,
  name: 'Ponçeuse',
  slug: 'ponceuse',
  category: {
    id: CATEGORIES[1].id,
    path: CATEGORIES[1].path,
    name: CATEGORIES[1].name,
  },
  owner: teamMatos,
  code: 'BR_OU_005',
  isPonctualUsage: true,
};

const SIMILAR_GEARS: Gear[] = [
  ...GEARS,
  TABLIER,
  PONCEUSE,
  {
    id: 6,
    name: 'Table',
    slug: 'table',
    category: {
      id: CATEGORIES[2].id,
      path: CATEGORIES[2].path,
      name: CATEGORIES[2].name,
    },
    owner: teamMatos,
    code: 'MO_006',
    isPonctualUsage: false,
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
      name               | category     | isPonctualUsage | expectedSlug       | expectedCategory                                         | expectedCodeStart | expectedOwner
      ${'Marteau'}       | ${2}         | ${true}         | ${'marteau'}       | ${{ id: 2, name: 'Outils', path: 'bricollage->outils' }} | ${'BR_OU_'}       | ${{ name: teamMatos.name, code: teamMatos.code }}
      ${'Scie Sauteuse'} | ${2}         | ${true}         | ${'scie-sauteuse'} | ${{ id: 2, name: 'Outils', path: 'bricollage->outils' }} | ${'BR_OU_'}       | ${{ name: teamMatos.name, code: teamMatos.code }}
      ${'Table'}         | ${3}         | ${false}        | ${'table'}         | ${{ id: 3, name: 'Mobilier', path: 'mobilier' }}         | ${'MO_'}          | ${{ name: teamMatos.name, code: teamMatos.code }}
      ${'Des'}           | ${undefined} | ${false}        | ${'des'}           | ${undefined}                                             | ${undefined}      | ${undefined}
      ${'Gants'}         | ${4}         | ${true}         | ${'gants'}         | ${{ id: 4, name: 'Divers', path: 'divers' }}             | ${'DI_'}          | ${undefined}
      ${'Vauban'}        | ${5}         | ${false}        | ${'vauban'}        | ${{ id: 5, name: 'Barrieres', path: 'barrieres' }}       | ${'BA_'}          | ${{ name: teamBarriere.name, code: teamBarriere.code }}
    `(
      'Add gear "$name" with #$category category to catalog',
      ({
        name,
        category,
        isPonctualUsage,
        expectedSlug,
        expectedCategory,
        expectedCodeStart,
        expectedOwner,
      }) => {
        let gear: Gear;
        afterAll(() => {
          gearRepository.gears = GEARS;
        });
        beforeAll(async () => {
          gear = await catalog.add({ name, category, isPonctualUsage });
        });
        it(`should create gear ${name} with generated id and slug "${expectedSlug}"`, () => {
          expect(gear).toHaveProperty('id');
          expect(gear.id).toEqual(expect.any(Number));
          expect(gear.name).toBe(name);
          expect(gear.slug).toBe(expectedSlug);
        });
        it(`should set up ponctual usage property`, () => {
          expect(gear.isPonctualUsage).toBe(isPonctualUsage);
        });
        if (expectedCategory) {
          it(`should link gear ${name} to category "${expectedCategory.name}"`, () => {
            expect(gear.category).toEqual(expectedCategory);
          });
          it('should generate a reference code', () => {
            expect(gear.code.startsWith(expectedCodeStart)).toBe(true);
          });
        }
        if (expectedOwner) {
          it(`should link gear ${name} to team "${expectedOwner.name}"`, () => {
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
              isPonctualUsage: false,
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
              isPonctualUsage: true,
            }),
        ).rejects.toThrow(`"Perceuse" gear already exist`);
      });
    });
  });
  describe('Update gear', () => {
    describe.each`
      toUpdateGear                                      | expectedSlug        | expectedCategory
      ${{ id: 1, name: 'Perceuse à vis', category: 2 }} | ${'perceuse-a-vis'} | ${{ id: 2, name: 'Outils', path: 'bricollage->outils' }}
      ${{ id: 3, name: 'Tireuse', category: 3 }}        | ${'tireuse'}        | ${{ id: 3, name: 'Mobilier', path: 'mobilier' }}
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
          async () =>
            await catalog.update({
              id: 123,
              name: 'Lavabo',
              isPonctualUsage: false,
            }),
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
      searchName   | searchCategory  | searchOwner  | searchPonctualUsage | expectedGears
      ${'TAblIer'} | ${undefined}    | ${undefined} | ${undefined}        | ${[TABLIER]}
      ${'TAblI'}   | ${undefined}    | ${undefined} | ${undefined}        | ${[TABLIER]}
      ${'TAbl'}    | ${undefined}    | ${undefined} | ${undefined}        | ${[TABLIER, SIMILAR_GEARS[5]]}
      ${'TAblI'}   | ${'Mobilier'}   | ${undefined} | ${undefined}        | ${[]}
      ${'euse'}    | ${undefined}    | ${undefined} | ${undefined}        | ${[PERCEUSE, SIMILAR_GEARS[2], PONCEUSE]}
      ${'euse'}    | ${'BricolLage'} | ${undefined} | ${undefined}        | ${[PERCEUSE, PONCEUSE]}
      ${undefined} | ${undefined}    | ${'Matos'}   | ${undefined}        | ${[PERCEUSE, SIMILAR_GEARS[1], PONCEUSE, SIMILAR_GEARS[5]]}
      ${undefined} | ${undefined}    | ${'maT'}     | ${undefined}        | ${[PERCEUSE, SIMILAR_GEARS[1], PONCEUSE, SIMILAR_GEARS[5]]}
      ${'tab'}     | ${undefined}    | ${'maT'}     | ${undefined}        | ${[SIMILAR_GEARS[5]]}
      ${'tab'}     | ${'Brico'}      | ${'maT'}     | ${undefined}        | ${[]}
      ${undefined} | ${undefined}    | ${undefined} | ${undefined}        | ${SIMILAR_GEARS}
      ${undefined} | ${undefined}    | ${undefined} | ${true}             | ${[PERCEUSE, TABLIER, PONCEUSE]}
    `(
      'When looking for "$searchName" in $searchCategory category with $searchOwner owner with ponctual usage: $searchPonctualUsage',
      ({
        searchName,
        searchCategory,
        searchOwner,
        searchPonctualUsage,
        expectedGears,
      }) => {
        it(`should retrieve ${expectedGears.length} gears`, async () => {
          const gears = await catalog.search({
            name: searchName,
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
