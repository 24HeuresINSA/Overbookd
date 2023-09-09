import {
  PayContributionForm,
  ContributionResponse,
} from "@overbookd/contribution";
import { PayContributionRepository } from "./pay-contribution.repository.";
import { PrismaService } from "../../prisma.service";
import {
  SELECT_CONTRIBUTION,
  WHERE_EXPIRATION_DATE_GREATER_THAN_NOW,
} from "../contribution.query";

export class PrismaPayContributionRepository
  implements PayContributionRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async pay(
    contributionData: PayContributionForm,
  ): Promise<ContributionResponse> {
    const { amount, userId } = contributionData;

    const currentDate = new Date();
    const expirationDate = new Date(currentDate.getFullYear(), 7, 31);

    if (currentDate > expirationDate) {
      expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    }

    return this.prisma.contribution.create({
      data: {
        userId,
        amount,
        paymentDate: currentDate,
        expirationDate,
      },
      select: SELECT_CONTRIBUTION,
    });
  }

  async find(userId: number): Promise<ContributionResponse | null> {
    return this.prisma.contribution.findFirst({
      where: {
        userId,
        ...WHERE_EXPIRATION_DATE_GREATER_THAN_NOW,
      },
      select: SELECT_CONTRIBUTION,
    });
  }
}
