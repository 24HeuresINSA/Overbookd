import {
  BARREL,
  DEPOSIT,
  PROVISIONS,
  SHARED_MEAL,
  TRANSFER,
  Transaction,
} from "@overbookd/personal-account";
import { PrismaService } from "../../prisma.service";
import { SELECT_TRANSACTION_USER } from "../transaction.query";

export class PrismaTransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getMine(myId: number): Promise<Transaction[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: { isDeleted: false, OR: [{ from: myId }, { to: myId }] },
      select: {
        type: true,
        amount: true,
        context: true,
        createdAt: true,
        payee: { select: SELECT_TRANSACTION_USER },
        payor: { select: SELECT_TRANSACTION_USER },
      },
      orderBy: { createdAt: "desc" },
    });

    return transactions.map((transaction) => {
      const { type, amount, context, createdAt, payee, payor } = transaction;
      const date = createdAt;

      switch (type) {
        case DEPOSIT:
        case BARREL:
        case PROVISIONS:
          return { type, amount, context, date };
        case TRANSFER:
          if (this.isPayor(payor.id, myId)) {
            return { type, amount, context, date, to: payee };
          }
          return { type, amount, context, date, from: payor };
        case SHARED_MEAL:
          if (this.isPayor(payor.id, myId)) {
            return { type, amount, context, date, to: payee };
          }
          return { type, amount, context, date, from: payor };
      }
    });
  }

  private isPayor(from: number, myId: number) {
    return from === myId;
  }
}
