import { Gear } from "@overbookd/logistic";
import { PrismaService } from "../../../prisma.service";
import { Gears } from "../../borrow/borrow.service";

export class PrismaGears implements Gears {
  constructor(private prisma: PrismaService) {}

  async findOne(slug: Gear["slug"]): Promise<Gear | undefined> {
    return this.prisma.catalogGear.findUnique({
      where: { slug },
      select: { name: true, slug: true },
    });
  }
}
