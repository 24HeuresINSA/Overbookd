import { ConfiguredBarrel } from "@overbookd/personal-account";
import { PrismaService } from "../../prisma.service";
import { Barrels } from "../transaction.service";
import { NotFoundException } from "@nestjs/common";

export class PrismaBarrels implements Barrels {
  constructor(private readonly prisma: PrismaService) {}

  async findBySlug(slug: string): Promise<ConfiguredBarrel> {
    const barrel = await this.prisma.barrel.findUnique({
      where: { slug },
    });
    if (!barrel) throw new NotFoundException("Fût introuvable");
    return barrel;
  }
}
