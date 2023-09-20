import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { ContributionController } from "./contribution.controller";
import { PrismaPayContributionRepository } from "./repository/pay-contribution-repository.prisma";
import { PrismaModule } from "../prisma.module";
import { ContributionService } from "./contribution.service";
import { PayContribution } from "@overbookd/contribution";

@Module({
  controllers: [ContributionController],
  providers: [
    {
      provide: PrismaPayContributionRepository,
      useFactory: (prisma: PrismaService) =>
        new PrismaPayContributionRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: PayContribution,
      useFactory: (
        payContributionRepository: PrismaPayContributionRepository,
      ) => new PayContribution(payContributionRepository),
      inject: [ContributionService],
    },
    {
      provide: ContributionService,
      useFactory: (
        payContributionRepository: PrismaPayContributionRepository,
        payContribution: PayContribution,
      ) => new ContributionService(payContributionRepository, payContribution),
      inject: [PrismaPayContributionRepository],
    },
  ],
  imports: [PrismaModule],
})
export class ContributionModule {}
