import { PrismaService } from "../../prisma.service";
import { Locations } from "../festival-activity.service";
import { SELECT_LOCATION } from "./location.query";

export class PrismaLocations implements Locations {
  constructor(private readonly prisma: PrismaService) {}

  find(id: number) {
    return this.prisma.signaLocation.findFirst({
      where: { id },
      select: SELECT_LOCATION,
    });
  }
}
