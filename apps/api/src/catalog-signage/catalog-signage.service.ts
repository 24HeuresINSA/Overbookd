import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { SignageForm, SignageUpdateForm } from "@overbookd/signa";

@Injectable()
export class CatalogSignageService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.catalogSignage.findMany();
  }

  async create(signage: SignageForm) {
    return this.prisma.catalogSignage.create({
      data: signage,
    });
  }

  async update(signage: SignageUpdateForm) {
    return this.prisma.catalogSignage.update({
      where: { id: signage.id },
      data: signage,
    });
  }

  async remove(id: number) {
    return this.prisma.catalogSignage.delete({ where: { id } });
  }
}
