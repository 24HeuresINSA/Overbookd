import { PayContributionForm, UserContribution } from "@overbookd/contribution";
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

  async pay(contributionData: PayContributionForm): Promise<UserContribution> {
    const { amount, userId } = contributionData;

    const currentDate = new Date();
    const expirationDate = new Date(currentDate.getFullYear(), 7, 31);

    if (currentDate > expirationDate) {
      expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    }

    const data = {
      userId,
      amount,
      paymentDate: currentDate,
      expirationDate,
    };

    return this.prisma.contribution.upsert({
      create: data,
      update: data,
      where: {
        userId,
        ...WHERE_EXPIRATION_DATE_GREATER_THAN_NOW,
      },
      select: SELECT_CONTRIBUTION,
    });
  }

  async find(userId: number): Promise<UserContribution | null> {
    return this.prisma.contribution.findFirst({
      where: {
        userId,
        ...WHERE_EXPIRATION_DATE_GREATER_THAN_NOW,
      },
      select: SELECT_CONTRIBUTION,
    });
  }

  async remove(userId: number): Promise<void> {
    await this.prisma.contribution.deleteMany({
      where: {
        userId,
        ...WHERE_EXPIRATION_DATE_GREATER_THAN_NOW,
      },
    });
  }
}
