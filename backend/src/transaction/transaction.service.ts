import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Transaction } from '@prisma/client';
import { User } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}
  /**     **/
  /** GET **/
  /**     **/
  async getAllTransactions(): Promise<Transaction[]> {
    return this.prisma.transaction.findMany();
  }

  async getTransactionById(id: number): Promise<Transaction | null> {
    return this.prisma.transaction.findUnique({ where: { id: Number(id) } });
  }

  async getUserTransactions(userId: number): Promise<Transaction[] | null> {
    return this.prisma.transaction.findMany({
      where: { OR: [{ from: Number(userId) }, { to: Number(userId) }] },
      orderBy: { created_at: 'desc' },
    });
  }

  /**      **/
  /** POST **/
  /**      **/
  async createTransaction(
    userTransaction: Omit<
      Transaction,
      'from' | 'type' | 'is_deleted' | 'created_at'
    >,
    userId: number,
  ): Promise<Transaction> {
    const data: Transaction = {
      ...userTransaction,
      from: userId,
      type: 'TRANSFER',
      is_deleted: false,
      created_at: new Date(),
    };
    this.checkTransactionAmount(data);
    //Check if user exists
    const users = await this.userExists([data.from, data.to]);
    const sender = users.find((user) => user.id === data.from);
    const receiver = users.find((user) => user.id === data.to);

    const senderBalance = sender.balance - data.amount;
    const receiverBalance = receiver.balance + data.amount;
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: Number(data.from) },
        data: { balance: senderBalance },
      }),
      this.prisma.user.update({
        where: { id: Number(data.to) },
        data: { balance: receiverBalance },
      }),
      this.prisma.transaction.create({
        data: data,
      }),
    ]);
    return data;
  }

  async addSgTransaction(transactions: Transaction[]): Promise<Transaction[]> {
    await Promise.all(
      transactions.map(async (transaction) => {
        this.checkTransactionAmount(transaction);
        //Check if user exists
        const userId =
          transaction.type === 'DEPOSIT' ? transaction.to : transaction.from;
        const users = await this.userExists([userId]);
        const user = users.find((user) => user.id === userId);
        const newBalance =
          transaction.type === 'DEPOSIT'
            ? user.balance + transaction.amount
            : user.balance - transaction.amount;
        //Update the user and create the transaction
        await this.prisma.$transaction([
          this.prisma.user.update({
            where: { id: Number(userId) },
            data: { balance: newBalance },
          }),
          this.prisma.transaction.create({ data: transaction }),
        ]);
      }),
    );
    return transactions;
  }

  /**        **/
  /** DELETE **/
  /**        **/
  async deleteTransaction(id: number): Promise<Transaction> {
    const transaction = await this.transactionExists(id);
    const operations: Array<any> = [
      this.prisma.transaction.update({
        where: { id: Number(id) },
        data: { is_deleted: true },
      }),
    ];
    if (['EXPENSE', 'TRANSFER'].includes(transaction.type)) {
      const user = await this.userExists([transaction.from]);
      const sender = user.find((user) => user.id === transaction.from);
      operations.push(
        this.prisma.user.update({
          where: { id: Number(transaction.from) },
          data: { balance: sender.balance + transaction.amount },
        }),
      );
    }
    if (['DEPOSIT', 'TRANSFER'].includes(transaction.type)) {
      const user = await this.userExists([transaction.to]);
      const receiver = user.find((user) => user.id === transaction.to);
      operations.push(
        this.prisma.user.update({
          where: { id: Number(transaction.to) },
          data: { balance: receiver.balance - transaction.amount },
        }),
      );
    }
    const response = await this.prisma.$transaction(operations);
    return response[0];
  }

  /**         **/
  /** HELPERS **/
  /**         **/
  checkTransactionAmount(transaction: Transaction): void {
    if (transaction.amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }
  }

  async userExists(userIds: number[]): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
    });
    if (users.length !== userIds.length) {
      throw new NotFoundException('User does not exist');
    }
    return users;
  }

  async transactionExists(transactionId: number): Promise<Transaction> {
    const transaction = await this.getTransactionById(transactionId);
    if (!transaction) {
      throw new NotFoundException(
        `Transaction with ID ${transactionId} not found`,
      );
    }
    if (transaction.is_deleted) {
      throw new BadRequestException(
        `Transaction with ID ${transactionId} is already deleted`,
      );
    }
    return transaction;
  }
}
