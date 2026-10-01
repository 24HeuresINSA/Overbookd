import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { VolunteerAvailabilityController } from "./volunteer-availability.controller";
import { VolunteerAvailabilityService } from "./volunteer-availability.service";
import { PrismaModule } from "../prisma.module";

@Module({
  controllers: [VolunteerAvailabilityController],
  providers: [
    {
      provide: VolunteerAvailabilityService,
      useFactory: (prisma: PrismaService) =>
        new VolunteerAvailabilityService(prisma),
      inject: [PrismaService],
    },
  ],
  imports: [PrismaModule],
  exports: [VolunteerAvailabilityService],
})
export class VolunteerAvailabilityModule {}
