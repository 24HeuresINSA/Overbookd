import { Module } from "@nestjs/common";
import { FestivalActivityOverviewService } from "./festival-activity-overview.service";
import { PrismaAdherents } from "../common/repository/adherents.prisma";
import {
  CreateFestivalActivity,
  PrepareFestivalActivity,
} from "@overbookd/festival-activity";
import { DomainEventService } from "../../domain-event/domain-event.service";
import { PrismaRemoveFestivalActivities } from "../common/repository/remove-festival-activities.prisma";
import { FestivalActivityCommonModule } from "../common/festival-activity-common.module";
import { DomainEventModule } from "../../domain-event/domain-event.module";

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
