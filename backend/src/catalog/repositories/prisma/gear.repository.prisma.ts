import { Injectable } from '@nestjs/common';
import { GearReferenceCodeService } from 'src/catalog/gearReferenceCode.service';
import { PrismaService } from '../../../prisma.service';
import {
  Gear,
  GearAlreadyExists,
  GearRepository,
  SearchGear,
} from '../../interfaces';

export type DatabaseGear = {
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
  isPonctualUsage: boolean;
  isConsumable: boolean;
};

export function convertGearToApiContract(gear: DatabaseGear) {
  const baseGear = {
    name: gear.name,
    slug: gear.slug,
    id: gear.id,
    isPonctualUsage: gear.isPonctualUsage,
    isConsumable: gear.isConsumable,
  };
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
  const code = category
    ? GearReferenceCodeService.computeGearCode(category, gear.id)
    : undefined;
  return { ...baseGear, category, owner, code };
}

@Injectable()
export class PrismaGearRepository implements GearRepository {
  private readonly SELECT_GEAR = {
    id: true,
    name: true,
    isPonctualUsage: true,
    isConsumable: true,
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
    return convertGearToApiContract(gear);
  }

  async addGear(gear: Omit<Gear, 'id'>): Promise<Gear> {
    try {
      const data = this.buildUpsertData(gear);
      const newGear = await this.prismaService.catalog_Gear.create({
        data,
        select: this.SELECT_GEAR,
      });
      return convertGearToApiContract(newGear);
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
    return convertGearToApiContract(updatedGear);
  }

  async removeGear(id: number): Promise<void> {
    await this.prismaService.catalog_Gear.delete({ where: { id } });
  }

  async searchGear(search: SearchGear): Promise<Gear[]> {
    const where = this.buildSearchConditions(search);
    return (
      await this.prismaService.catalog_Gear.findMany({
        select: this.SELECT_GEAR,
        where,
      })
    ).map(convertGearToApiContract);
  }

  private buildSearchConditions({
    slug,
    category,
    owner,
    ponctualUsage,
  }: SearchGear) {
    const slugCondition = slug ? { slug: { contains: slug } } : {};
    const categoryCondition = this.buildCategorySearchCondition(
      category,
      owner,
    );
    const ponctualUsageCondition = this.buildUsageCondition(ponctualUsage);

    return {
      ...slugCondition,
      ...categoryCondition,
      ...ponctualUsageCondition,
    };
  }

  private buildUsageCondition(ponctualUsage: boolean) {
    return ponctualUsage !== undefined
      ? { isPonctualUsage: ponctualUsage }
      : {};
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
