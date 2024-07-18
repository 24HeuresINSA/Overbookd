import { Adherents, Balance } from "@overbookd/personal-account";
import { PrismaService } from "../../prisma.service";
import { SELECT_TRANSACTIONS_FOR_BALANCE } from "../../common/query/transaction.query";

export class PrismaAdherents implements Adherents {
  constructor(private readonly prisma: PrismaService) {}

  async getBalance(adherentId: number): Promise<number> {
    const adherent = await this.prisma.user.findUnique({
      where: { id: adherentId },
      select: SELECT_TRANSACTIONS_FOR_BALANCE,
    });
    return Balance.calculate(adherent);
  }
}
