import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Transaction } from '@prisma/client';
import { HttpException, HttpStatus } from '@nestjs/common';

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
    data: Transaction,
    userId: number,
  ): Promise<Transaction> {
    this.isTransactionOK(data);
    if (userId !== data.from) {
      throw new HttpException(
        'You can only create transactions from your own account',
        HttpStatus.BAD_REQUEST,
      );
    }
    //Check if user exists
    const sender = await this.prisma.user.findUnique({
      where: { id: Number(data.from) },
    });
    const receiver = await this.prisma.user.findUnique({
      where: { id: Number(data.to) },
    });
    if (!sender || !receiver) {
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
    }
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
    transactions.forEach(async (transaction) => {
      this.isTransactionOK(transaction);
      //Check if user exists
      const userId =
        transaction.from === -1 ? transaction.to : transaction.from; //We only deal with expense and deposit
      const user = await this.prisma.user.findUnique({
        where: { id: Number(userId) },
      });
      if (!user) {
        throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
      }
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
    });
    return transactions;
  }

  isTransactionOK(transaction: Transaction): void {
    if (transaction.amount <= 0) {
      throw new HttpException(
        'Amount must be positive',
        HttpStatus.BAD_REQUEST,
      );
    }
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
}
