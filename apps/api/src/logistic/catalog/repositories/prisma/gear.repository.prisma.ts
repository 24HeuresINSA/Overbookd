import { Injectable } from "@nestjs/common";
import { GearReferenceCodeService } from "../../gear-reference-code.service";
import { PrismaService } from "../../../../prisma.service";
import { Gear, GearAlreadyExists, GearRepository } from "../../types";
import { GearSearchOptions } from "@overbookd/http";
import { GearQueryBuilder } from "../../../common/gear.query";

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
    const gear = await this.prismaService.catalogGear.findUnique({
      select: this.SELECT_GEAR,
      where: { id },
    });
    if (!gear) {
      return undefined;
    }
    return convertGearToApiContract(gear);
  }

  async addGear(gear: Omit<Gear, "id">): Promise<Gear> {
    try {
      const data = this.buildUpsertData(gear);
      const newGear = await this.prismaService.catalogGear.create({
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

  private buildUpsertData(gear: Omit<Gear, "id">) {
    const { category, owner, ...baseGear } = gear;
    const categoryLink = category
      ? { category: { connect: { id: category.id } } }
      : {};

    return { ...baseGear, ...categoryLink };
  }

  async updateGear(gear: Omit<Gear, "owner">): Promise<Gear> {
    const { id, category, ...data } = gear;
    const updatedGear = await this.prismaService.catalogGear.update({
      data: { ...data, category: { connect: { id: category.id } } },
      select: this.SELECT_GEAR,
      where: { id },
    });
    return convertGearToApiContract(updatedGear);
  }

  async removeGear(id: number): Promise<void> {
    await this.prismaService.catalogGear.delete({ where: { id } });
  }

  async searchGear(options: GearSearchOptions): Promise<Gear[]> {
    const where = GearQueryBuilder.find(options);
    return (
      await this.prismaService.catalogGear.findMany({
        select: this.SELECT_GEAR,
        where,
      })
    ).map(convertGearToApiContract);
  }
}
