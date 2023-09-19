import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { Signage, SignageForm, SignageUpdateForm } from "@overbookd/signa";

@Injectable()
export class CatalogSignageService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Signage[]> {
    return this.prisma.catalogSignage.findMany();
  }

  async create(signage: SignageForm): Promise<Signage> {
    return this.prisma.catalogSignage.create({
      data: signage,
    });
  }

  async update(signage: SignageUpdateForm): Promise<Signage> {
    return this.prisma.catalogSignage.update({
      where: { id: signage.id },
      data: signage,
    });
  }

  async remove(id: number): Promise<void> {
    await this.prisma.catalogSignage.delete({ where: { id } });
  }
}
