import { PrismaService } from "../../../../prisma.service";
import { Gear, Inquiries } from "../../festival-task-common.model";
import { IS_PONCTUAL_USAGE, SELECT_GEAR } from "./inquiry.query";

export class PrismaInquiries implements Inquiries {
  constructor(private readonly prisma: PrismaService) {}

  find(slug: string): Promise<Gear | null> {
    return this.prisma.catalogGear.findUnique({
      where: { slug, ...IS_PONCTUAL_USAGE },
      select: SELECT_GEAR,
    });
  }
}
