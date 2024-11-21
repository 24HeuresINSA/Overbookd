import { Module } from "@nestjs/common";
import { VolunteerMembershipApplicationController } from "./volunteer-membership-application.controller";
import { PrismaCandidates } from "../common/repository/candidates.prisma";
import { PrismaService } from "../../../prisma.service";
import { PrismaUsers } from "../common/repository/users.prisma";
import { PrismaEnrollCandidates } from "../common/repository/enroll-candidates.prisma";
import {
  ApplyFor,
  EnrollCandidates,
  RejectMembershipApplication,
} from "@overbookd/registration";
import { VolunteerMembershipApplicationService } from "./volunteer-membership-application.service";
import { PrismaModule } from "../../../prisma.module";
import { DomainEventService } from "../../../domain-event/domain-event.service";
import { PrismaMemberships } from "../common/repository/memberships.prisma";
import { DomainEventModule } from "../../../domain-event/domain-event.module";

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
      ) =>
        new VolunteerMembershipApplicationService(
          { applyFor, reject, enroll },
          { users, enrollCandidates },
        ),
      inject: [
        ApplyFor,
        RejectMembershipApplication,
        PrismaUsers,
        PrismaEnrollCandidates,
        EnrollCandidates,
      ],
    },
  ],
  imports: [PrismaModule, DomainEventModule],
})
export class VolunteerMembershipApplicationModule {}
