import {
  EXTERNAL_EVENT,
  ExternalEventTransaction,
  ExternalEventTransactionForm,
} from "@overbookd/personal-account";
import { PrismaService } from "../../prisma.service";
import { SELECT_BASE_TRANSACTION } from "./transaction.query";
import { SELECT_USER_IDENTIFIER } from "../../common/query/user.query";
import { ExternalEventTransactions } from "@overbookd/personal-account";

export class PrismaExternalEventTransactions implements ExternalEventTransactions {
  constructor(private readonly prisma: PrismaService) {}

  async save(
    transaction: ExternalEventTransactionForm,
  ): Promise<ExternalEventTransaction> {
    const newTransaction = await this.prisma.transaction.create({
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
    });

    return {
      amount: newTransaction.amount,
      context: newTransaction.context,
      type: newTransaction.type as typeof EXTERNAL_EVENT,
      from: newTransaction.payee,
      date: newTransaction.createdAt,
    };
  }
}
