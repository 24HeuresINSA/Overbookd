import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { VolunteerAvailabilityController } from "./volunteer-availability.controller";
import { VolunteerAvailabilityService } from "./volunteer-availability.service";
import { DomainEventService } from "../domain-event/domain-event.service";

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
  exports: [VolunteerAvailabilityService],
})
export class VolunteerAvailabilityModule {}
