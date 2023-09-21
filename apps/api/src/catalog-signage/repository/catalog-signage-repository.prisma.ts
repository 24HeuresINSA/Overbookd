import { Signage, SignageForm } from "@overbookd/signa";
import { PrismaService } from "../../prisma.service";
import { CatalogSignageRepository } from "../catalog-signage.service";
import { SlugifyService } from "@overbookd/slugify";

export class PrismaCatalogSignageRepository
  implements CatalogSignageRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Signage[]> {
    return this.prisma.catalogSignage.findMany();
  }

  async create(signage: SignageForm): Promise<Signage> {
    const slug = SlugifyService.apply(signage.name);
    return this.prisma.catalogSignage.create({
      data: { ...signage, slug },
    });
  }

  async update(id: number, signage: SignageForm): Promise<Signage> {
    const slug = SlugifyService.apply(signage.name);
    return this.prisma.catalogSignage.update({
      where: { id },
      data: { ...signage, slug },
    });
  }

  async remove(id: number): Promise<void> {
    await this.prisma.catalogSignage.delete({ where: { id } });
  }
}
