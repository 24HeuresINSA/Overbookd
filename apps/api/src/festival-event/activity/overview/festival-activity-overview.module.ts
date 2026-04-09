import { Module } from "@nestjs/common";
import {
  CreateFestivalActivity,
  PrepareFestivalActivity,
} from "@overbookd/festival-event";
import { DomainEventModule } from "../../../domain-event/domain-event.module";
import { DomainEventService } from "../../../domain-event/domain-event.service";
import { FestivalActivityCommonModule } from "../common/festival-activity-common.module";
import { PrismaAdherents } from "../common/repository/adherents.prisma";
import { PrismaRemoveFestivalActivities } from "../common/repository/remove-festival-activities.prisma";
import { FestivalActivityOverviewService } from "./festival-activity-overview.service";

@Module({
  providers: [
    {
      provide: FestivalActivityOverviewService,
      useFactory: (
        adherents: PrismaAdherents,
        create: CreateFestivalActivity,
        prepare: PrepareFestivalActivity,
        remove: PrismaRemoveFestivalActivities,
        eventStore: DomainEventService,
      ) =>
        new FestivalActivityOverviewService(
          adherents,
          create,
          prepare,
          remove,
          eventStore,
        ),
      inject: [
        PrismaAdherents,
        CreateFestivalActivity,
        PrepareFestivalActivity,
        PrismaRemoveFestivalActivities,
        DomainEventService,
      ],
    },
  ],
  imports: [FestivalActivityCommonModule, DomainEventModule],
  exports: [FestivalActivityOverviewService],
})
export class FestivalActivityOverviewModule {}
