import { Location } from "@overbookd/festival-event";
import { PrismaService } from "../../../prisma.service";
import { SELECT_LOCATION } from "./location.query";

export type Locations = {
  find(id: number): Promise<Location | null>;
};

export class PrismaLocations implements Locations {
  constructor(private readonly prisma: PrismaService) {}

  find(id: number) {
    return this.prisma.signaLocation.findFirst({
      where: { id },
      select: SELECT_LOCATION,
    });
  }
}
