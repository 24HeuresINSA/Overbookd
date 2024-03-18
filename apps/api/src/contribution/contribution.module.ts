import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { ContributionController } from "./contribution.controller";
import { PrismaPayContributions } from "./repository/pay-contributions.prisma";
import { PrismaModule } from "../prisma.module";
import { ContributionService } from "./contribution.service";
import { EditContribution, PayContribution } from "@overbookd/contribution";
import { PrismaEditContributions } from "./repository/edit-contributions.prisma";

@Module({
  controllers: [ContributionController],
  providers: [
    {
      provide: PrismaPayContributions,
      useFactory: (prisma: PrismaService) => new PrismaPayContributions(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaEditContributions,
      useFactory: (prisma: PrismaService) =>
        new PrismaEditContributions(prisma),
      inject: [PrismaService],
    },
    {
      provide: PayContribution,
      useFactory: (payContributions: PrismaPayContributions) =>
        new PayContribution(payContributions),
      inject: [PrismaPayContributions],
    },
    {
      provide: EditContribution,
      useFactory: (editContributions: PrismaEditContributions) =>
        new EditContribution(editContributions),
      inject: [PrismaEditContributions],
    },
    {
      provide: ContributionService,
      useFactory: (
        payContribution: PayContribution,
        editContributions: EditContribution,
      ) => new ContributionService(payContribution, editContributions),
      inject: [PayContribution, EditContribution],
    },
  ],
  imports: [PrismaModule],
})
export class ContributionModule {}
