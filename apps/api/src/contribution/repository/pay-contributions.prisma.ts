import {
  Adherent,
  Contribution,
  PayContributions,
} from "@overbookd/contribution";
import { PrismaService } from "../../prisma.service";
import {
  SELECT_ADHERENT,
  WHERE_CAN_PAY_CONTRIBUTION,
} from "./contribution.query";

export class PrismaPayContributions implements PayContributions {
  constructor(private readonly prisma: PrismaService) {}

  async findAdherentsOutToDate(edition: number): Promise<Adherent[]> {
    const prismaAdherents = await this.prisma.user.findMany({
      where: {
        contributions: { none: { edition } },
        ...WHERE_CAN_PAY_CONTRIBUTION,
      },
      select: SELECT_ADHERENT,
    });
    return prismaAdherents.map(({ teams: teamCodes, ...adherent }) => {
      const teams = teamCodes.map(({ teamCode }) => teamCode);
      return { ...adherent, teams };
    });
  }

  async pay(contribution: Contribution): Promise<Contribution> {
    return this.prisma.contribution.create({ data: contribution });
  }

  async isAllowedToPay(memberId: number): Promise<boolean> {
    const user = this.prisma.user.findFirst({
      where: { id: memberId, ...WHERE_CAN_PAY_CONTRIBUTION },
    });
    return Boolean(user);
  }

  async hasAlreadyPayed(adherentId: number, edition: number): Promise<boolean> {
    const contribution = await this.prisma.contribution.findFirst({
      where: { adherentId, edition },
    });
    return Boolean(contribution);
  }
}
