import { Injectable } from '@nestjs/common';
import { PrismaPromise } from '@prisma/client';
import { PrismaService } from '../../../prisma.service';
import {
  Category,
  CategoryAlreadyExists,
  CategoryRepository,
  CategoryTree,
  SearchCategory,
} from '../../interfaces';

@Injectable()
export class PrismaCategoryRepository implements CategoryRepository {
  private readonly SELECT_CATEGORY = {
    id: true,
    name: true,
    path: true,
    parent: true,
    owner: {
      select: {
        name: true,
        code: true,
      },
    },
  };

  constructor(private readonly prismaService: PrismaService) {}

  getCategory(id: number): Promise<Category> {
    return this.prismaService.catalog_Category.findUnique({
      select: this.SELECT_CATEGORY,
      where: { id },
    });
  }

  getSubCategories(parentId: number): Promise<Category[]> {
    return this.prismaService.catalog_Category.findMany({
      select: this.SELECT_CATEGORY,
      where: {
        parent: parentId,
      },
    });
  }

  async addCategory(category: Omit<Category, 'id'>): Promise<Category> {
    try {
      const data = this.buildUpsertData(category);
      return await this.prismaService.catalog_Category.create({
        select: this.SELECT_CATEGORY,
        data,
      });
    } catch (e) {
      if (this.prismaService.isUniqueConstraintViolation(e)) {
        throw new CategoryAlreadyExists(category);
      }
      throw e;
    }
  }

  removeCategory(id: number): Promise<Category> {
    return this.prismaService.catalog_Category.delete({ where: { id } });
  }

  updateCategories(categories: Category[]): Promise<Category[]> {
    return this.prismaService.$transaction(
      categories.map((category) => this.updateCategory(category)),
    );
  }

  updateCategory(category: Category): PrismaPromise<Category> {
    const { id, ...baseCategory } = category;
    const data = this.buildUpsertData(baseCategory);
    return this.prismaService.catalog_Category.update({
      select: this.SELECT_CATEGORY,
      data,
      where: { id },
    });
  }

  getCategoryTrees(): Promise<CategoryTree[]> {
    return this.prismaService.catalog_Category.findMany({
      select: {
        ...this.SELECT_CATEGORY,
        subCategories: {
          select: {
            ...this.SELECT_CATEGORY,
            subCategories: {
              select: {
                ...this.SELECT_CATEGORY,
                subCategories: {
                  select: {
                    ...this.SELECT_CATEGORY,
                  },
                },
              },
            },
          },
        },
      },
      where: { parent: null },
    });
  }

  searchCategory(search: SearchCategory): Promise<Category[]> {
    const where = this.buildSearchConditions(search);
    return this.prismaService.catalog_Category.findMany({
      select: this.SELECT_CATEGORY,
      where,
    });
  }

  private buildSearchConditions({ name, owner }: SearchCategory) {
    const nameCondition = name ? { path: { contains: name } } : {};
    const ownerCondition = owner
      ? {
          owner: {
            code: {
              contains: owner,
            },
          },
        }
      : {};

    return { ...nameCondition, ...ownerCondition };
  }

  private buildUpsertData(category: Omit<Category, 'id'>) {
    const { owner, parent, ...baseCategory } = category;
    const ownerLink = owner ? { owner: { connect: { code: owner.code } } } : {};
    const parentLink = parent
      ? { parentCategory: { connect: { id: parent } } }
      : {};

    return { ...baseCategory, ...ownerLink, ...parentLink };
  }
}
