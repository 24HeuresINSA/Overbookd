import { Module } from "@nestjs/common";
import { MembershipApplicationController } from "./membership-application.controller";
import { MembershipApplicationService } from "./membership-application.service";
import { PrismaModule } from "../../prisma.module";
import { PrismaCandidates } from "./repository/candidates.prisma";
import { PrismaService } from "../../prisma.service";
import { ApplyFor, RejectMembershipApplication } from "@overbookd/registration";
import { PrismaUsers } from "./repository/users.prisma";

@Module({
  controllers: [MembershipApplicationController],
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
      provide: MembershipApplicationService,
      useFactory: (
        applyFor: ApplyFor,
        reject: RejectMembershipApplication,
        users: PrismaUsers,
      ) => new MembershipApplicationService(applyFor, reject, users),
      inject: [ApplyFor, RejectMembershipApplication, PrismaUsers],
    },
  ],
  imports: [PrismaModule],
})
export class MembershipApplicationModule {}
