import { Module } from "@nestjs/common";
import { SignaSectionService } from "./signa-section.service";
import { PrepareFestivalActivity } from "@overbookd/festival-event";
import { PrismaCatalogSignages } from "../../common/repository/catalog-signages.prisma";
import { PrismaLocations } from "../../common/repository/locations.prisma";
import { FestivalActivityCommonModule } from "../../common/festival-activity-common.module";

@Module({
  providers: [
    {
      provide: SignaSectionService,
      useFactory: (
        locations: PrismaLocations,
        prepare: PrepareFestivalActivity,
        catalogSignages: PrismaCatalogSignages,
      ) => new SignaSectionService(locations, prepare, catalogSignages),
      inject: [PrismaLocations, PrepareFestivalActivity, PrismaCatalogSignages],
    },
  ],
  imports: [FestivalActivityCommonModule],
  exports: [SignaSectionService],
})
export class SignaSectionModule {}
