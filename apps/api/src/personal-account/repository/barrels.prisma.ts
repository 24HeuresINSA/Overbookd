import type { Barrels, ConfiguredBarrel } from "@overbookd/personal-account";
import { PrismaService } from "../../prisma.service";

export class PrismaBarrels implements Barrels {
  constructor(private readonly prisma: PrismaService) {}

  findBySlug(slug: string): Promise<ConfiguredBarrel | undefined> {
    return this.prisma.barrel.findUnique({ where: { slug } });
  }
  find(): Promise<ConfiguredBarrel[]> {
    return this.prisma.barrel.findMany();
  }
  create(barrel: ConfiguredBarrel): Promise<ConfiguredBarrel> {
    return this.prisma.barrel.create({ data: barrel });
  }
  save(barrel: ConfiguredBarrel): Promise<ConfiguredBarrel> {
    return this.prisma.barrel.update({
      where: { slug: barrel.slug },
      data: barrel,
    });
  }
  async remove(slug: string): Promise<void> {
    await this.prisma.barrel.delete({ where: { slug } });
  }
}
