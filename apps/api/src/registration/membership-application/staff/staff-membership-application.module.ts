import { Module } from "@nestjs/common";
import { ApplyFor, RejectMembershipApplication } from "@overbookd/registration";
import { StaffMembershipApplicationController } from "./staff-membership-application.controller";
import { PrismaModule } from "../../../prisma.module";
import { PrismaService } from "../../../prisma.service";
import { PrismaCandidates } from "../common/repository/candidates.prisma";
import { PrismaUsers } from "../common/repository/users.prisma";
import { StaffMembershipApplicationService } from "./staff-membership-application.service";
import { PrismaConfigurations } from "./repository/configurations.prisma";
import { PrismaEnrollCandidates } from "../common/repository/enroll-candidates.prisma";

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
      provide: StaffMembershipApplicationService,
      useFactory: (
        applyFor: ApplyFor,
        reject: RejectMembershipApplication,
        users: PrismaUsers,
        configurations: PrismaConfigurations,
        enrollCandidates: PrismaEnrollCandidates,
      ) =>
        new StaffMembershipApplicationService(
          { applyFor, reject },
          { users, configurations, enrollCandidates },
        ),
      inject: [
        ApplyFor,
        RejectMembershipApplication,
        PrismaUsers,
        PrismaConfigurations,
        PrismaEnrollCandidates,
      ],
    },
  ],
  imports: [PrismaModule],
})
export class StaffMembershipApplicationModule {}
