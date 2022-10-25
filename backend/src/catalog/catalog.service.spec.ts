import { SlugifyService } from '../common/services/slugify.service';
import { Category, CategoryRepository } from './interfaces';
import { InMemoryCategoryRepository } from './repositories';

class CatalogService {
  constructor(
    private readonly slugService: SlugifyService,
    private readonly categoryRepository: CategoryRepository,
  ) {}
  async add({
    name,
    category: categoryId,
  }: {
    name: string;
    category?: number;
  }) {
    const slug = this.slugService.slugify(name);
    const { parent, owner, ...category } =
      await this.categoryRepository.getCategory(categoryId);
    return {
      id: 1,
      name,
      slug,
      category,
    };
  }
}
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
  const catalog = new CatalogService(new SlugifyService(), categoryRepository);
  beforeAll(() => {
    categoryRepository.categories = CATEGORIES;
  });
  describe.each`
    name               | category | expectedSlug       | expectedCategory
    ${'Marteau'}       | ${2}     | ${'marteau'}       | ${{ id: 2, name: 'Outils', slug: 'bricollage->outils' }}
    ${'Scie Sauteuse'} | ${2}     | ${'scie-sauteuse'} | ${{ id: 2, name: 'Outils', slug: 'bricollage->outils' }}
    ${'Table'}         | ${3}     | ${'table'}         | ${{ id: 3, name: 'Mobilier', slug: 'mobilier' }}
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
      it(`should link gear ${name} to category "${expectedCategory.name}"`, async () => {
        const gear = await catalog.add({ name, category });
        expect(gear.category).toMatchObject(expectedCategory);
      });
    },
  );
});
