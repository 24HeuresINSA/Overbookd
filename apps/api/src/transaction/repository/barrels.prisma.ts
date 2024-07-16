import { ConfiguredBarrel } from "@overbookd/personal-account";
import { PrismaService } from "../../prisma.service";
import { Barrels } from "../transaction.service";

export class PrismaBarrels implements Barrels {
  constructor(private readonly prisma: PrismaService) {}

  async findBySlug(slug: string): Promise<ConfiguredBarrel> {
    return this.prisma.barrel.findUnique({
      where: { slug },
    });
  }
}
