import { Module } from "@nestjs/common";
import { VolunteerMembershipApplicationController } from "./volunteer-membership-application.controller";
import { PrismaCandidates } from "../common/repository/candidates.prisma";
import { PrismaService } from "../../../prisma.service";
import { PrismaUsers } from "../common/repository/users.prisma";
import { PrismaEnrollCandidates } from "../common/repository/enroll-candidates.prisma";
import { ApplyFor, RejectMembershipApplication } from "@overbookd/registration";
import { VolunteerMembershipApplicationService } from "./volunteer-membership-application.service";
import { PrismaModule } from "../../../prisma.module";

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
      provide: VolunteerMembershipApplicationService,
      useFactory: (
        applyFor: ApplyFor,
        reject: RejectMembershipApplication,
        users: PrismaUsers,
        enrollCandidates: PrismaEnrollCandidates,
      ) =>
        new VolunteerMembershipApplicationService(
          { applyFor, reject },
          { users, enrollCandidates },
        ),
      inject: [
        ApplyFor,
        RejectMembershipApplication,
        PrismaUsers,
        PrismaEnrollCandidates,
      ],
    },
  ],
  imports: [PrismaModule],
})
export class VolunteerMembershipApplicationModule {}
