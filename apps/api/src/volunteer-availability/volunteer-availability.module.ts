import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { VolunteerAvailabilityController } from "./volunteer-availability.controller";
import { VolunteerAvailabilityService } from "./volunteer-availability.service";

@Module({
  controllers: [VolunteerAvailabilityController],
  providers: [VolunteerAvailabilityService, PrismaService],
  exports: [VolunteerAvailabilityService],
})
export class VolunteerAvailabilityModule {}
