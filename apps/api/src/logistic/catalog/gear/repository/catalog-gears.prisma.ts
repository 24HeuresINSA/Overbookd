import { Injectable } from "@nestjs/common";
import {
  GearLinkedItems,
  CatalogGears,
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
}
