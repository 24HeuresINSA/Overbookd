import { Module } from "@nestjs/common";
import {
  ApplyFor,
  EnrollCandidates,
  RejectMembershipApplication,
} from "@overbookd/registration";
import { ConfigurationModule } from "../../../configuration/configuration.module";
import { ConfigurationService } from "../../../configuration/configuration.service";
import { DomainEventModule } from "../../../domain-event/domain-event.module";
import { DomainEventService } from "../../../domain-event/domain-event.service";
import { PrismaModule } from "../../../prisma.module";
import { PrismaService } from "../../../prisma.service";
import { PrismaCandidates } from "../common/repository/candidates.prisma";
import { PrismaEnrollCandidates } from "../common/repository/enroll-candidates.prisma";
import { PrismaMemberships } from "../common/repository/memberships.prisma";
import { PrismaUsers } from "../common/repository/users.prisma";
import { VolunteerMembershipApplicationController } from "./volunteer-membership-application.controller";
import { VolunteerMembershipApplicationService } from "./volunteer-membership-application.service";

@Module({
  controllers: [VolunteerMembershipApplicationController],
  providers: [
    {
      provide: PrismaCandidates,
      useFactory: (prisma: PrismaService) => new PrismaCandidates(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaUsers,
      useFactory: (prisma: PrismaService) => new PrismaUsers(prisma),
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
        users: PrismaUsers,
        enrollCandidates: PrismaEnrollCandidates,
        enroll: EnrollCandidates,
        configuration: ConfigurationService,
      ) =>
        new VolunteerMembershipApplicationService(
          { applyFor, reject, enroll },
          { users, enroll: enrollCandidates, configuration },
        ),
      inject: [
        ApplyFor,
        RejectMembershipApplication,
        PrismaUsers,
        PrismaEnrollCandidates,
        EnrollCandidates,
        ConfigurationService,
      ],
    },
  ],
  imports: [PrismaModule, DomainEventModule, ConfigurationModule],
})
export class VolunteerMembershipApplicationModule {}
