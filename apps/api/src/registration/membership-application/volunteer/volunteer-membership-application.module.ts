import { Module } from "@nestjs/common";
import { VolunteerMembershipApplicationController } from "./volunteer-membership-application.controller";
import { PrismaCandidates } from "../common/repository/candidates.prisma";
import { PrismaService } from "../../../prisma.service";
import { PrismaEnrollCandidates } from "../common/repository/enroll-candidates.prisma";
import {
  ApplyFor,
  EnrollCandidates,
  RejectMembershipApplication,
  SwitchMembershipApplication,
} from "@overbookd/registration";
import { VolunteerMembershipApplicationService } from "./volunteer-membership-application.service";
import { PrismaModule } from "../../../prisma.module";
import { DomainEventService } from "../../../domain-event/domain-event.service";
import { PrismaMemberships } from "../common/repository/memberships.prisma";
import { DomainEventModule } from "../../../domain-event/domain-event.module";
import { ConfigurationModule } from "../../../configuration/configuration.module";

@Module({
  controllers: [VolunteerMembershipApplicationController],
  providers: [
    {
      provide: PrismaCandidates,
      useFactory: (prisma: PrismaService) => new PrismaCandidates(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaEnrollCandidates,
      useFactory: (prisma: PrismaService) => new PrismaEnrollCandidates(prisma),
      inject: [PrismaService],
    },
    {
      provide: ApplyFor,
      useFactory: (candidates: PrismaCandidates) => new ApplyFor(candidates),
      inject: [PrismaCandidates],
    },
    {
      provide: RejectMembershipApplication,
      useFactory: (candidates: PrismaCandidates) =>
        new RejectMembershipApplication(candidates),
      inject: [PrismaCandidates],
    },
    {
      provide: SwitchMembershipApplication,
      useFactory: (candidates: PrismaCandidates) =>
        new SwitchMembershipApplication(candidates),
      inject: [PrismaCandidates],
    },
    {
      provide: PrismaMemberships,
      useFactory: (prisma: PrismaService) => new PrismaMemberships(prisma),
      inject: [PrismaService],
    },
    {
      provide: EnrollCandidates,
      useFactory: (
        memberships: PrismaMemberships,
        events: DomainEventService,
      ) => new EnrollCandidates(memberships, events),
      inject: [PrismaMemberships, DomainEventService],
    },
    {
      provide: VolunteerMembershipApplicationService,
      useFactory: (
        applyFor: ApplyFor,
        reject: RejectMembershipApplication,
        switchApplication: SwitchMembershipApplication,
        enrollCandidates: PrismaEnrollCandidates,
        enroll: EnrollCandidates,
      ) =>
        new VolunteerMembershipApplicationService(
          { applyFor, reject, switchApplication, enroll },
          { enroll: enrollCandidates },
        ),
      inject: [
        ApplyFor,
        RejectMembershipApplication,
        SwitchMembershipApplication,
        PrismaEnrollCandidates,
        EnrollCandidates,
      ],
    },
  ],
  imports: [PrismaModule, DomainEventModule, ConfigurationModule],
})
export class VolunteerMembershipApplicationModule {}
