import { Injectable } from "@nestjs/common";
import {
  CatalogCategory,
  CatalogCategoryTree,
  CategorySearchOptions,
} from "@overbookd/http";
import { PrismaService } from "../../../../prisma.service";
import { CategoryAlreadyExists } from "../../catalog.error";
import { CategoryRepository } from "../catalog-repositories";

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

  getCategory(id: number): Promise<CatalogCategory> {
    return this.prismaService.catalogCategory.findUnique({
      select: this.SELECT_CATEGORY,
      where: { id },
    });
  }

  getSubCategories(parentId: number): Promise<CatalogCategory[]> {
    return this.prismaService.catalogCategory.findMany({
      select: this.SELECT_CATEGORY,
      where: {
        parent: parentId,
      },
    });
  }

  async addCategory(
    category: Omit<CatalogCategory, "id">,
  ): Promise<CatalogCategory> {
    try {
      const data = this.buildUpsertData(category);
      return await this.prismaService.catalogCategory.create({
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

  removeCategory(id: number): Promise<CatalogCategory> {
    return this.prismaService.catalogCategory.delete({ where: { id } });
  }

  updateCategories(categories: CatalogCategory[]): Promise<CatalogCategory[]> {
    return this.prismaService.$transaction(
      categories.map((category) => this.updateCategory(category)),
    );
  }

  updateCategory(category: CatalogCategory) {
    const { id, ...baseCategory } = category;
    const data = this.buildUpsertData(baseCategory);
    return this.prismaService.catalogCategory.update({
      select: this.SELECT_CATEGORY,
      data,
      where: { id },
    });
  }

  getCategoryTrees(): Promise<CatalogCategoryTree[]> {
    return this.prismaService.catalogCategory.findMany({
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

  searchCategory(search: CategorySearchOptions): Promise<CatalogCategory[]> {
    const where = this.buildSearchConditions(search);
    return this.prismaService.catalogCategory.findMany({
      select: this.SELECT_CATEGORY,
      where,
    });
  }

  private buildSearchConditions({ name, owner }: CategorySearchOptions) {
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

  private buildUpsertData(category: Omit<CatalogCategory, "id">) {
    const { owner, parent, ...baseCategory } = category;
    const ownerLink = owner ? { owner: { connect: { code: owner.code } } } : {};
    const parentLink = parent
      ? { parentCategory: { connect: { id: parent } } }
      : {};

    return { ...baseCategory, ...ownerLink, ...parentLink };
  }
}
