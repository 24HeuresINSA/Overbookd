import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import {
  Gear,
  GearAlreadyExists,
  GearRepository,
  SearchGear,
} from '../../interfaces';

type DatabaseGear = {
  id: number;
  name: string;
  slug: string;
  category: {
    owner: {
      name: string;
      code: string;
    };
    id: number;
    name: string;
    path: string;
  };
};

@Injectable()
export class PrismaGearRepository implements GearRepository {
  private readonly SELECT_GEAR = {
    id: true,
    name: true,
    slug: true,
    category: {
      select: {
        id: true,
        name: true,
        path: true,
        owner: {
          select: {
            name: true,
            code: true,
          },
        },
      },
    },
  };

  constructor(private readonly prismaService: PrismaService) {}

  async getGear(id: number): Promise<Gear | undefined> {
    const gear = await this.prismaService.catalog_Gear.findUnique({
      select: this.SELECT_GEAR,
      where: { id },
    });
    if (!gear) {
      return undefined;
    }
    return this.convertToApiContract(gear);
  }

  private convertToApiContract(gear: DatabaseGear) {
    const baseGear = { name: gear.name, slug: gear.slug, id: gear.id };
    const category = gear.category
      ? {
          name: gear.category.name,
          path: gear.category.path,
          id: gear.category.id,
        }
      : undefined;
    const owner = gear.category?.owner
      ? { name: gear.category.owner.name, code: gear.category.owner.code }
      : undefined;
    return { ...baseGear, category, owner };
  }

  async addGear(gear: Omit<Gear, 'id'>): Promise<Gear> {
    try {
      const data = this.buildUpsertData(gear);
      const newGear = await this.prismaService.catalog_Gear.create({
        data,
        select: this.SELECT_GEAR,
      });
      return this.convertToApiContract(newGear);
    } catch (e) {
      if (this.prismaService.isUniqueConstraintViolation(e)) {
        throw new GearAlreadyExists(gear);
      }
      throw e;
    }
  }

  private buildUpsertData(gear: Omit<Gear, 'id'>) {
    const { category, owner, ...baseGear } = gear;
    const categoryLink = category
      ? { category: { connect: { id: category.id } } }
      : {};

    return { ...baseGear, ...categoryLink };
  }

  async updateGear(gear: Omit<Gear, 'owner'>): Promise<Gear> {
    const { id, category, ...data } = gear;
    const updatedGear = await this.prismaService.catalog_Gear.update({
      data: { ...data, category: { connect: { id: category.id } } },
      select: this.SELECT_GEAR,
      where: { id },
    });
    return this.convertToApiContract(updatedGear);
  }

  async removeGear(id: number): Promise<void> {
    await this.prismaService.catalog_Gear.delete({ where: { id } });
  }

  async searchGear(search: SearchGear): Promise<Gear[]> {
    const where = this.buildSearchConditions(search);
    return this.prismaService.catalog_Gear.findMany({
      select: this.SELECT_GEAR,
      where,
    });
  }

  private buildSearchConditions({ slug, category, owner }: SearchGear) {
    const slugCondition = slug ? { slug: { contains: slug } } : {};
    const categoryCondition = this.buildCategorySearchCondition(
      category,
      owner,
    );

    return { ...slugCondition, ...categoryCondition };
  }

  private buildCategorySearchCondition(category: string, owner: string) {
    if (!owner && !category) return {};

    const baseCategoryNameCondition = category
      ? { path: { contains: category } }
      : {};
    const baseCategoryOwnerCondition = owner
      ? { owner: { code: { contains: owner } } }
      : {};

    return {
      category: {
        ...baseCategoryNameCondition,
        ...baseCategoryOwnerCondition,
      },
    };
  }
}
