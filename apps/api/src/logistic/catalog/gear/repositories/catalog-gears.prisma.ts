import { Injectable } from "@nestjs/common";
import {
  GearLinkedItems,
  CatalogGears,
  CatalogGear,
  GearSearchOptions,
  SavedCatalogGear,
} from "@overbookd/logistic";
import { PrismaService } from "../../../../prisma.service";
import { GearFilter } from "../../../common/gear.filter";
import {
  DatabaseGear,
  SELECT_GEAR,
} from "../../../common/repositories/gear.query";

export function convertGearToApiContract(gear: DatabaseGear): SavedCatalogGear {
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
  return { ...baseGear, category, owner };
}

@Injectable()
export class PrismaCatalogGears implements CatalogGears {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: number): Promise<SavedCatalogGear | undefined> {
    const gear = await this.prismaService.catalogGear.findUnique({
      where: { id },
      select: SELECT_GEAR,
    });
    return gear ? convertGearToApiContract(gear) : undefined;
  }

  async findBySlug(slug: string): Promise<SavedCatalogGear | undefined> {
    const gear = await this.prismaService.catalogGear.findUnique({
      where: { slug },
      select: SELECT_GEAR,
    });
    return gear ? convertGearToApiContract(gear) : undefined;
  }

  async addGear(gear: Omit<SavedCatalogGear, "id">): Promise<SavedCatalogGear> {
    const newGear = await this.prismaService.catalogGear.create({
      data: this.buildUpsertData(gear),
      select: SELECT_GEAR,
    });
    return convertGearToApiContract(newGear);
  }

  private buildUpsertData(gear: Omit<SavedCatalogGear, "id">) {
    const { category, owner: _, ...baseGear } = gear;
    const categoryLink = category
      ? { category: { connect: { id: category.id } } }
      : {};

    return { ...baseGear, ...categoryLink };
  }

  async updateGear(gear: SavedCatalogGear): Promise<SavedCatalogGear> {
    const { id, category, owner: _, ...data } = gear;
    const updatedGear = await this.prismaService.catalogGear.update({
      data: { ...data, category: { connect: { id: category.id } } },
      select: SELECT_GEAR,
      where: { id },
    });
    return convertGearToApiContract(updatedGear);
  }

  async removeGear(id: number): Promise<void> {
    await this.prismaService.catalogGear.delete({ where: { id } });
  }

  async getLinkedItems(id: number): Promise<GearLinkedItems> {
    const gear = await this.prismaService.catalogGear.findUnique({
      where: { id },
      select: {
        festivalActivityInquiries: { select: { faId: true } },
        festivalTaskInquiries: { select: { ftId: true } },
        borrows: { select: { borrowId: true } },
      },
    });
    return {
      activities: gear.festivalActivityInquiries.map(({ faId }) => faId),
      tasks: gear.festivalTaskInquiries.map(({ ftId }) => ftId),
      borrows: gear.borrows.map(({ borrowId }) => borrowId),
    };
  }

  async getLastId(): Promise<number> {
    const lastGear = await this.prismaService.catalogGear.findFirst({
      orderBy: { id: "desc" },
      select: { id: true },
    });
    return lastGear?.id ?? 0;
  }

  async searchGear(options: GearSearchOptions): Promise<CatalogGear[]> {
    const gears = await this.prismaService.catalogGear.findMany({
      select: SELECT_GEAR,
    });
    const filteredGears = GearFilter.apply(gears, options);
    return filteredGears.map(convertGearToApiContract);
  }
}
