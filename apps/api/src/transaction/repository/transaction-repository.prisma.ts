import {
  BARREL,
  DEPOSIT,
  PROVISIONS,
  TRANSFER,
  Transaction,
} from "@overbookd/personal-account";
import { PrismaService } from "../../prisma.service";

export class PrismaTransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getMine(myId: number): Promise<Transaction[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: { OR: [{ from: myId }, { to: myId }] },
      select: {
        type: true,
        amount: true,
        context: true,
        createdAt: true,
        to: true,
        from: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return transactions.map((transactionData) => {
      const { type, amount, context, createdAt, to, from } = transactionData;
      const date = createdAt;

      switch (type) {
        case DEPOSIT:
        case BARREL:
        case PROVISIONS:
          return { type, amount, context, date };
        case TRANSFER:
          if (this.isPayor(from, myId)) {
            return { type, amount, context, date, to };
          }
          return { type, amount, context, date, from };
      }
    });
  }

  private isPayor(from: number, myId: number) {
    return from === myId;
  }
}
