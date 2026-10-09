import { Injectable } from "@nestjs/common";
import {
  GearLinkedItems,
  CatalogGears,
  CatalogGear,
  SavedCatalogGear,
} from "@overbookd/logistic";
import { PrismaService } from "../../../../prisma.service";
import {
  convertGearToApiContract,
  SELECT_GEAR,
} from "../../../common/gear.query";

@Injectable()
export class PrismaCatalogGears implements CatalogGears {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: number): Promise<CatalogGear | undefined> {
    const gear = await this.prismaService.catalogGear.findUnique({
      where: { id },
      select: SELECT_GEAR,
    });
    return gear ? convertGearToApiContract(gear) : undefined;
  }

  async findBySlug(slug: string): Promise<CatalogGear | undefined> {
    const gear = await this.prismaService.catalogGear.findUnique({
      where: { slug },
      select: SELECT_GEAR,
    });
    return gear ? convertGearToApiContract(gear) : undefined;
  }

  async addGear(gear: Omit<SavedCatalogGear, "id">): Promise<CatalogGear> {
    const { category, owner: _, ...baseGear } = gear;
    const newGear = await this.prismaService.catalogGear.create({
      data: { ...baseGear, category: { connect: { id: category.id } } },
      select: SELECT_GEAR,
    });
    return convertGearToApiContract(newGear);
  }

  async updateGear(gear: SavedCatalogGear): Promise<CatalogGear> {
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
}
