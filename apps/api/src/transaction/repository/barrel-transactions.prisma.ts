import {
  BARREL,
  BarrelTransaction,
  BarrelTransactionForm,
  BarrelTransactions,
} from "@overbookd/personal-account";
import { PrismaService } from "../../prisma.service";
import { SELECT_BASE_TRANSACTION } from "./transaction.query";
import { SELECT_USER_IDENTIFIER } from "../../common/query/user.query";

export class PrismaBarrelTransactions implements BarrelTransactions {
  constructor(private readonly prisma: PrismaService) {}

  async saveMany(
    transactions: BarrelTransactionForm[],
  ): Promise<BarrelTransaction[]> {
    const created = await Promise.all(
      transactions.map((transaction) =>
        this.prisma.transaction.create({
          data: {
            amount: transaction.amount,
            context: transaction.context,
            createdAt: transaction.date,
            from: transaction.from,
            type: transaction.type,
          },
          select: {
            ...SELECT_BASE_TRANSACTION,
            payee: { select: SELECT_USER_IDENTIFIER },
          },
        }),
      ),
    );

    return created.map((transaction) => ({
      amount: transaction.amount,
      context: transaction.context,
      type: transaction.type as typeof BARREL,
      from: transaction.payee,
      date: transaction.createdAt,
    }));
  }
}
