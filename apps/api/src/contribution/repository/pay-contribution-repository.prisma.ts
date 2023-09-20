import { UnauthorizedException } from "@nestjs/common";
import {
  Contribution,
  ContributionRepository,
  PayContribution,
  UserContribution,
} from "@overbookd/contribution";
import { PrismaService } from "../../prisma.service";
import { SELECT_CONTRIBUTION, WHERE_CAN_PAY_CONTRIBUTION } from "../contribution.query";
import { SELECT_USER_PERSONNAL_DATA } from "../../user/user.query";
import { UserService } from "../../user/user.service";
import { UserPersonnalData } from "@overbookd/user";

export class PrismaPayContributionRepository implements ContributionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUsersWithNoContribution(): Promise<UserPersonnalData[]> {
    const WHERE_EDITION_IS_CURRENT = PrismaPayContributionRepository.buildEditionIsCurrentCondition();
    const users = await this.prisma.user.findMany({
      where: {
        contributions: {
          none: WHERE_EDITION_IS_CURRENT,
        },
        ...WHERE_CAN_PAY_CONTRIBUTION,
      },
      select: SELECT_USER_PERSONNAL_DATA,
    });
    return users.map(UserService.formatToPersonalData);
  }

  async pay(contribution: Contribution): Promise<UserContribution> {
    const canPay = await this.canPayContribution(contribution.userId);
    if (!canPay) {
      throw new UnauthorizedException("Ce bénévole ne peut pas payer de contribution");
    }

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

  private async canPayContribution(id: number): Promise<boolean> {
    return this.prisma.user.findFirst({
      where: {
        id,
        ...WHERE_CAN_PAY_CONTRIBUTION,
      },
    });
  }
}
