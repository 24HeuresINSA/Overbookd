import {
  Contribution,
  ContributionRepository,
  PayContribution,
  UserContribution,
} from "@overbookd/contribution";
import { PrismaService } from "../../prisma.service";
import { SELECT_CONTRIBUTION } from "../contribution.query";
import { SELECT_USER_PERSONNAL_DATA } from "../../user/user.query";
import { UserService } from "../../user/user.service";
import { UserPersonnalData } from "@overbookd/user";

export class PrismaPayContributionRepository implements ContributionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUsersWithNoContribution(): Promise<UserPersonnalData[]> {
    const currentEdition = PayContribution.getCurrentEdition();
    const users = await this.prisma.user.findMany({
      where: {
        contributions: {
          none: { edition: currentEdition },
        },
      },
      select: SELECT_USER_PERSONNAL_DATA,
    });
    return users.map(UserService.formatToPersonalData);
  }

  async pay(contribution: Contribution): Promise<UserContribution> {
    return this.prisma.contribution.create({
      data: contribution,
      select: SELECT_CONTRIBUTION,
    });
  }

  async remove(userId: number): Promise<void> {
    await this.prisma.contribution.delete({
      where: {
        userId_edition: {
          userId,
          ...PrismaPayContributionRepository.buildEditionIsCurrentCondition(),
        },
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
