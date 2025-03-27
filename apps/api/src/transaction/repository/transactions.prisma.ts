import {
  BARREL,
  DEPOSIT,
  PROVISIONS,
  SHARED_MEAL,
  TRANSFER,
  MyTransaction,
  INITIALIZATION,
  EXTERNAL_EVENT,
  TransactionWithSenderAndReceiver,
  SharedMealTransaction,
} from "@overbookd/personal-account";
import { PrismaService } from "../../prisma.service";
import { SELECT_COMPLETE_TRANSACTION } from "./transaction.query";
import { IS_NOT_DELETED } from "../../common/query/not-deleted.query";
import { Transactions } from "../transaction.service";
import { BadRequestException, NotFoundException } from "@nestjs/common";

export class PrismaTransactions implements Transactions {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(): Promise<TransactionWithSenderAndReceiver[]> {
    const transactions = await this.prisma.transaction.findMany({
      select: { ...SELECT_COMPLETE_TRANSACTION, isDeleted: true },
      orderBy: { createdAt: "desc" },
    });
    return transactions.map(({ createdAt, ...transaction }) => ({
      ...transaction,
      date: createdAt,
    }));
  }

  async existsAndIsNotDeleted(id: number): Promise<boolean> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      select: { isDeleted: true },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction avec l'id ${id} introuvable`);
    }
    if (transaction.isDeleted) {
      throw new BadRequestException(
        `Transaction avec l'id ${id} déjà supprimée`,
      );
    }
    return true;
  }

  async deleteOne(id: number): Promise<void> {
    await this.prisma.transaction.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

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

  async createManyForSharedMeal(
    transactions: SharedMealTransaction[],
  ): Promise<void> {
    await this.prisma.transaction.createMany({
      data: transactions,
    });
  }
}
