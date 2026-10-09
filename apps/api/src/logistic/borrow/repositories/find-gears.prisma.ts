import { Gear } from "@overbookd/logistic";
import { PrismaService } from "../../../prisma.service";

export type FindGears = {
  findOne(slug: Gear["slug"]): Promise<Gear>;
};

export class PrismaFindGears implements FindGears {
  constructor(private prisma: PrismaService) {}

  async findOne(slug: Gear["slug"]): Promise<Gear | undefined> {
    return this.prisma.catalogGear.findUnique({
      where: { slug },
      select: { name: true, slug: true },
    });
  }
}
