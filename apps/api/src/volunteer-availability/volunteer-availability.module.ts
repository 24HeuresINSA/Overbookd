import { Module } from "@nestjs/common";
import { DomainEventModule } from "../domain-event/domain-event.module";
import { DomainEventService } from "../domain-event/domain-event.service";
import { PrismaModule } from "../prisma.module";
import { PrismaService } from "../prisma.service";
import { VolunteerAvailabilityController } from "./volunteer-availability.controller";
import { VolunteerAvailabilityService } from "./volunteer-availability.service";

@Module({
  controllers: [VolunteerAvailabilityController],
  providers: [
    {
      provide: VolunteerAvailabilityService,
      useFactory: (eventStore: DomainEventService, prisma: PrismaService) =>
        new VolunteerAvailabilityService(eventStore, prisma),
      inject: [DomainEventService, PrismaService],
    },
  ],
  imports: [PrismaModule, DomainEventModule],
  exports: [VolunteerAvailabilityService],
})
export class VolunteerAvailabilityModule {}
