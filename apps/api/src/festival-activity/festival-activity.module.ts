import { Module } from "@nestjs/common";
import { FestivalActivityController } from "./festival-activity.controller";
import { FestivalActivityService } from "./festival-activity.service";
import { InMemoryFestivalActivityRepository } from "./repository/festival-activity-repository.inmemory";

@Module({
  controllers: [FestivalActivityController],
  providers: [
    {
      provide: InMemoryFestivalActivityRepository,
      useFactory: () => new InMemoryFestivalActivityRepository(),
    },
    {
      provide: FestivalActivityService,
      useFactory: (festivalActivities: InMemoryFestivalActivityRepository) =>
        new FestivalActivityService(festivalActivities),
    },
  ],
})
export class FestivalActivityModule {}
