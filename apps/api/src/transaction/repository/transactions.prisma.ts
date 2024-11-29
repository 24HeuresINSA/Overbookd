import {
  BARREL,
  DEPOSIT,
  PROVISIONS,
  SHARED_MEAL,
  TRANSFER,
  MyTransaction,
  INITIALIZATION,
  EXTERNAL_EVENT,
} from "@overbookd/personal-account";
import { PrismaService } from "../../prisma.service";
import { SELECT_COMPLETE_TRANSACTION } from "./transaction.query";
import { IS_NOT_DELETED } from "../../common/query/not-deleted.query";

export class PrismaTransactions {
  constructor(private readonly prisma: PrismaService) {}

  async getMine(myId: number): Promise<MyTransaction[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: { ...IS_NOT_DELETED, OR: [{ from: myId }, { to: myId }] },
      select: SELECT_COMPLETE_TRANSACTION,
      orderBy: { createdAt: "desc" },
    });

    return transactions.map((transaction) => {
      const { type, amount, context, createdAt, payee, payor } = transaction;
      const date = createdAt;

      switch (type) {
        case DEPOSIT:
          return { type, amount, context, date, to: payee };
        case BARREL:
        case PROVISIONS:
        case EXTERNAL_EVENT:
          return { type, amount, context, date, from: payor };
        case TRANSFER:
          if (payor && this.isPayor(payor.id, myId)) {
            return { type, amount, context, date, to: payee };
          }
          return { type, amount, context, date, from: payor };
        case SHARED_MEAL:
          if (payor && this.isPayor(payor.id, myId)) {
            return { type, amount, context, date, to: payee };
          }
          return { type, amount, context, date, from: payor };
        case INITIALIZATION:
          if (payor && this.isPayor(payor.id, myId)) {
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
