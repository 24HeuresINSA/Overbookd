import {
  CatalogGear,
  GearReferenceCodeGenerator,
  GearSearchOptions,
} from "@overbookd/logistic";
import { convertGearToApiContract, SELECT_GEAR } from "./gear.query";
import { GearFilter } from "./gear.filter";
import { PrismaService } from "../../prisma.service";
import { SearchGears } from "./search-gears";

export class PrismaSearchGears implements SearchGears {
  constructor(private readonly prismaService: PrismaService) {}

  async search(searchOptions: GearSearchOptions): Promise<CatalogGear[]> {
    const gears = await this.prismaService.catalogGear.findMany({
      select: SELECT_GEAR,
    });
    const filteredGears = GearFilter.apply(gears, searchOptions);
    return filteredGears.map((gear) => ({
      ...convertGearToApiContract(gear),
      code: gear.category
        ? GearReferenceCodeGenerator.generate(gear.category, gear.id)
        : undefined,
    }));
  }
}
