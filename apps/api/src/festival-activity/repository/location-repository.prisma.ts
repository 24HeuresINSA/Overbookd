import { PrismaService } from "../../prisma.service";
import { Locations } from "../festival-activity.service";

const SELECT_LOCATION = {
  id: true,
  name: true,
};

export class PrismaLocationRepository implements Locations {
  constructor(private readonly prisma: PrismaService) {}

  find(id: number) {
    return this.prisma.signaLocation.findFirst({
      where: { id },
      select: SELECT_LOCATION,
    });
  }
}
