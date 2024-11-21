import { Module } from "@nestjs/common";
import {
  ApplyFor,
  EnrollCandidates,
  RejectMembershipApplication,
} from "@overbookd/registration";
import { StaffMembershipApplicationController } from "./staff-membership-application.controller";
import { PrismaModule } from "../../../prisma.module";
import { PrismaService } from "../../../prisma.service";
import { PrismaCandidates } from "../common/repository/candidates.prisma";
import { PrismaUsers } from "../common/repository/users.prisma";
import { StaffMembershipApplicationService } from "./staff-membership-application.service";
import { PrismaConfigurations } from "./repository/configurations.prisma";
import { PrismaEnrollCandidates } from "../common/repository/enroll-candidates.prisma";
import { DomainEventModule } from "../../../domain-event/domain-event.module";
import { DomainEventService } from "../../../domain-event/domain-event.service";
import { PrismaMemberships } from "../common/repository/memberships.prisma";

@Module({
  controllers: [StaffMembershipApplicationController],
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
      provide: PrismaConfigurations,
      useFactory: (prisma: PrismaService) => new PrismaConfigurations(prisma),
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
      provide: StaffMembershipApplicationService,
      useFactory: (
        applyFor: ApplyFor,
        reject: RejectMembershipApplication,
        users: PrismaUsers,
        configurations: PrismaConfigurations,
        enrollCandidates: PrismaEnrollCandidates,
        enroll: EnrollCandidates,
      ) =>
        new StaffMembershipApplicationService(
          { applyFor, reject, enroll },
          { users, configurations, enroll: enrollCandidates },
        ),
      inject: [
        ApplyFor,
        RejectMembershipApplication,
        PrismaUsers,
        PrismaConfigurations,
        PrismaEnrollCandidates,
        EnrollCandidates,
      ],
    },
  ],
  imports: [PrismaModule, DomainEventModule],
})
export class StaffMembershipApplicationModule {}
