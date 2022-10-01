import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Transaction, Prisma } from '@prisma/client';
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
    data: Prisma.TransactionCreateInput,
  ): Promise<Transaction> {
    //We check the transaction type
    switch (data.type) {
      case 'TRANSFER':
        //If the transaction is a transfer, we check that the sender and the receiver are different
        if (data.from === data.to) {
          throw new HttpException(
            'Sender and receiver must be different',
            HttpStatus.FORBIDDEN,
          );
        }
        break;
      case 'DEPOSIT':
        //If the transaction is a deposit, we check that the sender is the same as the receiver
        if (data.from !== data.to) {
          throw new HttpException(
            'Sender and receiver must be the same',
            HttpStatus.FORBIDDEN,
          );
        }
        //If the amount is negative, we throw an error
        if (data.amount < 0) {
          throw new HttpException(
            'Amount must be positive',
            HttpStatus.FORBIDDEN,
          );
        }
        //We check that the sender is a user
        const user = await this.prisma.user.findUnique({
          where: { id: Number(data.from) },
        });
        if (!user) {
          throw new HttpException(
            'Sender must be a user',
            HttpStatus.FORBIDDEN,
          );
        }
        //Compute the new balance of the user
        const newBalance = user.balance + data.amount;
        //Update the balance of the user
        await this.prisma.user.update({
          where: { id: Number(data.from) },
          data: { balance: newBalance },
        });
        break;
      case 'EXPENSE':
        console.log('expense');
        break;
      default:
        //If the transaction type is not valid, we throw an error
        throw new HttpException(
          'Unknown transaction type',
          HttpStatus.FORBIDDEN,
        );
    }
    return this.prisma.transaction.create({ data });
  }

  /**        **/
  /** DELETE **/
  /**        **/
  async deleteTransaction(id: number): Promise<Transaction> {
    return this.prisma.transaction.delete({ where: { id: Number(id) } });
  }
}
