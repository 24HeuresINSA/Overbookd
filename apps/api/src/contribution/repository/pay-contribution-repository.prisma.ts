import {
  Contribution,
  ContributionRepository,
  PayContribution,
  UserContribution,
} from "@overbookd/contribution";
import { PrismaService } from "../../prisma.service";
import { SELECT_CONTRIBUTION } from "../contribution.query";

export class PrismaPayContributionRepository
  implements ContributionRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async pay(contribution: Contribution): Promise<UserContribution> {
    return this.prisma.contribution.create({
      data: contribution,
      select: SELECT_CONTRIBUTION,
    });
  }

  async find(userId: number): Promise<UserContribution | null> {
    return this.prisma.contribution.findFirst({
      where: {
        userId,
        ...PrismaPayContributionRepository.buildEditionIsCurrentCondition(),
      },
      select: SELECT_CONTRIBUTION,
    });
  }

  async remove(userId: number): Promise<void> {
    await this.prisma.contribution.delete({
      where: {
        userId,
        ...PrismaPayContributionRepository.buildEditionIsCurrentCondition(),
      },
    });
  }

  async hasAlreadyPayed(userId: number, edition: number): Promise<boolean> {
    const contribution = await this.prisma.contribution.findFirst({
      where: { userId, edition },
    });
    return Boolean(contribution);
  }

  static buildEditionIsCurrentCondition() {
    const currentEdition = PayContribution.getCurrentEdition();
    return { edition: currentEdition };
  }
}
