import {
  Adherent,
  Contribution,
  ContributionRepository,
} from "@overbookd/contribution";
import { PrismaService } from "../../prisma.service";
import {
  SELECT_ADHERENT,
  WHERE_CAN_PAY_CONTRIBUTION,
} from "../contribution.query";

export class PrismaPayContributionRepository implements ContributionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAdherentsOutToDate(edition: number): Promise<Adherent[]> {
    return this.prisma.user.findMany({
      where: {
        contributions: {
          none: { edition },
        },
        ...WHERE_CAN_PAY_CONTRIBUTION,
      },
      select: SELECT_ADHERENT,
    });
  }

  async pay(contribution: Contribution): Promise<Contribution> {
    const { adherentId, ...rest } = contribution;
    const data = { ...rest, userId: adherentId };
    const { userId, ...fromDatabase } = await this.prisma.contribution.create({
      data,
    });
    return { adherentId, ...fromDatabase };
  }

  async isAllowedToPay(userId: number): Promise<boolean> {
    const user = this.prisma.user.findFirst({
      where: {
        id: userId,
        ...WHERE_CAN_PAY_CONTRIBUTION,
      },
    });
    return Boolean(user);
  }

  async hasAlreadyPayed(userId: number, edition: number): Promise<boolean> {
    const contribution = await this.prisma.contribution.findFirst({
      where: { userId, edition },
    });
    return Boolean(contribution);
  }
}
