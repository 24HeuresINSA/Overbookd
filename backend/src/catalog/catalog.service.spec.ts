import { SlugifyService } from '../common/services/slugify.service';
import { CatalogService } from './catalog.service';
import { Category } from './interfaces';
import {
  InMemoryCategoryRepository,
  InMemoryGearRepository,
} from './repositories';

const teamMatos = { id: 1, name: 'matos' };

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
    gearRepository.gears = [];
  });
  describe.each`
    name               | category     | expectedSlug       | expectedCategory
    ${'Marteau'}       | ${2}         | ${'marteau'}       | ${{ id: 2, name: 'Outils', slug: 'bricollage->outils' }}
    ${'Scie Sauteuse'} | ${2}         | ${'scie-sauteuse'} | ${{ id: 2, name: 'Outils', slug: 'bricollage->outils' }}
    ${'Table'}         | ${3}         | ${'table'}         | ${{ id: 3, name: 'Mobilier', slug: 'mobilier' }}
    ${'Des'}           | ${undefined} | ${'des'}           | ${undefined}
  `(
    'Add gear "$name" to catalog',
    ({ name, category, expectedSlug, expectedCategory }) => {
      it(`should create gear ${name} with generated id and slug "${expectedSlug}"`, async () => {
        const gear = await catalog.add({ name, category });
        expect(gear).toHaveProperty('id');
        expect(gear.id).toEqual(expect.any(Number));
        expect(gear.name).toBe(name);
        expect(gear.slug).toBe(expectedSlug);
      });
      if (expectedCategory) {
        it(`should link gear ${name} to category "${expectedCategory.name}"`, async () => {
          const gear = await catalog.add({ name, category });
          expect(gear.category).toMatchObject(expectedCategory);
          expect(gear.category).not.toHaveProperty('parent');
          expect(gear.category).not.toHaveProperty('owner');
        });
      }
      it(`should be accessible after`, async () => {
        const createdGear = await catalog.add({ name, category });
        const fetchedGear = await catalog.find(createdGear.id);
        expect(createdGear).toMatchObject(fetchedGear);
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
});
