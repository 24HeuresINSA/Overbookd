import {
  DEPOSIT,
  Deposits,
  DepositTransaction,
  DepositTransactionForm,
} from "@overbookd/personal-account";
import { PrismaService } from "../../prisma.service";
import { SELECT_USER_IDENTIFIER } from "../../common/query/user.query";

export class PrismaDeposits implements Deposits {
  constructor(private readonly prisma: PrismaService) {}

  async save(deposit: DepositTransactionForm): Promise<DepositTransaction> {
    const transaction = await this.prisma.transaction.create({
      data: {
        amount: deposit.amount,
        context: deposit.context,
        type: deposit.type,
        to: deposit.to,
        createdAt: deposit.date,
      },
      select: {
        amount: true,
        context: true,
        type: true,
        payee: { select: SELECT_USER_IDENTIFIER },
        createdAt: true,
      },
    });
    return {
      amount: transaction.amount,
      context: transaction.context,
      type: transaction.type as typeof DEPOSIT,
      to: transaction.payee,
      date: transaction.createdAt,
    };
  }
}
