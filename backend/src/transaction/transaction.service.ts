import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
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
    });
  }

  /**      **/
  /** POST **/
  /**      **/
  async createTransaction(
    userTransaction: Omit<Transaction, 'from' | 'type'>,
    userId: number,
  ): Promise<Transaction> {
    const data: Transaction = {
      ...userTransaction,
      from: userId,
      type: 'TRANSFER',
    };
    //Check if user exists
    const users = await this.userExists([data.from, data.to]);
    const sender = users.find((user) => user.id === data.from);
    const receiver = users.find((user) => user.id === data.to);

    const senderBalance = sender.balance - data.amount;
    const receiverBalance = receiver.balance + data.amount;
    this.prisma.$transaction([
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
          transaction.from === -1 ? transaction.to : transaction.from; //We only deal with expense and deposit
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
    //change parameter is_deleted to true
    return this.prisma.transaction.update({
      where: { id: Number(id) },
      data: { is_deleted: true },
    });
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
}
