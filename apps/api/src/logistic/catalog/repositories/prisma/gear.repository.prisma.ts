import { Injectable } from "@nestjs/common";
import { GearReferenceCodeService } from "../../gear-reference-code.service";
import { PrismaService } from "../../../../prisma.service";
import { GearRepository } from "../catalog-repositories";
import { GearAlreadyExists } from "../../catalog.error";
import { CatalogGear, GearSearchOptions } from "@overbookd/http";
import { GearFilter } from "../../../common/gear.filter";
import { DatabaseGear, SELECT_GEAR } from "../../../common/dto/gear.query";

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
  constructor(private readonly prismaService: PrismaService) {}

  async getGear(id: number): Promise<CatalogGear | undefined> {
    const gear = await this.prismaService.catalogGear.findUnique({
      select: SELECT_GEAR,
      where: { id },
    });
    return gear ? convertGearToApiContract(gear) : undefined;
  }

  async addGear(gear: Omit<CatalogGear, "id">): Promise<CatalogGear> {
    try {
      const data = this.buildUpsertData(gear);
      const newGear = await this.prismaService.catalogGear.create({
        data,
        select: SELECT_GEAR,
      });
      return convertGearToApiContract(newGear);
    } catch (e) {
      if (this.prismaService.isUniqueConstraintViolation(e)) {
        throw new GearAlreadyExists(gear);
      }
      throw e;
    }
  }

  private buildUpsertData(gear: Omit<CatalogGear, "id">) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { category, owner, ...baseGear } = gear;
    const categoryLink = category
      ? { category: { connect: { id: category.id } } }
      : {};

    return { ...baseGear, ...categoryLink };
  }

  async updateGear(gear: Omit<CatalogGear, "owner">): Promise<CatalogGear> {
    const { id, category, ...data } = gear;
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

  async searchGear(options: GearSearchOptions): Promise<CatalogGear[]> {
    const gears = await this.prismaService.catalogGear.findMany({
      select: SELECT_GEAR,
    });
    const filteredGears = GearFilter.apply(gears, options);
    return filteredGears.map(convertGearToApiContract);
  }
}
