import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { ContributionController } from "./contribution.controller";
import { PrismaPayContributionRepository } from "./repository/pay-contribution-repository.prisma";
import { PrismaModule } from "../prisma.module";
import { ContributionService } from "./contribution.service";

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
      provide: ContributionService,
      useFactory: (
        payContributionRepository: PrismaPayContributionRepository,
      ) => new ContributionService(payContributionRepository),
      inject: [PrismaPayContributionRepository],
    },
  ],
  imports: [PrismaModule],
})
export class ContributionModule {}
