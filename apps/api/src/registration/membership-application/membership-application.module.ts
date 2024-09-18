import { Module } from "@nestjs/common";
import { MembershipApplicationController } from "./membership-application.controller";
import { MembershipApplicationService } from "./membership-application.service";
import { PrismaModule } from "../../prisma.module";
import { PrismaCandidates } from "./repository/candidates.prisma";
import { PrismaService } from "../../prisma.service";
import { ApplyFor } from "@overbookd/registration";

@Module({
  controllers: [MembershipApplicationController],
  providers: [
    {
      provide: PrismaCandidates,
      useFactory: (prisma: PrismaService) => new PrismaCandidates(prisma),
      inject: [PrismaService],
    },
    {
      provide: ApplyFor,
      useFactory: (candidates: PrismaCandidates) => new ApplyFor(candidates),
      inject: [PrismaCandidates],
    },
    {
      provide: MembershipApplicationService,
      useFactory: (applyFor: ApplyFor) =>
        new MembershipApplicationService(applyFor),
      inject: [ApplyFor],
    },
  ],
  imports: [PrismaModule],
})
export class MembershipApplicationModule {}
