import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import {
  PayContributionForm,
  ContributionResponse,
} from "./contribution.model";

@Injectable()
export class ContributionService {
  constructor(private prisma: PrismaService) {}

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
      select: {
        amount: true,
        paymentDate: true,
      },
    });
  }

  async find(userId: number): Promise<ContributionResponse | null> {
    return this.prisma.contribution.findFirst({
      where: {
        userId,
        expirationDate: { gte: new Date() },
      },
      select: {
        amount: true,
        paymentDate: true,
      },
    });
  }
}
