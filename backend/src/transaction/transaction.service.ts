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
    currentUser: any,
  ): Promise<Transaction> {
    //If the amount is negative, we throw an error
    if (data.amount < 0) {
      throw new HttpException('Amount must be positive', HttpStatus.FORBIDDEN);
    }
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
        //We check if the sender is the user who is logged in
        if (data.from !== currentUser.id) {
          throw new HttpException(
            'You are not the sender',
            HttpStatus.FORBIDDEN,
          );
        }
        //We check that sender and receiver exist
        const sender = await this.prisma.user.findUnique({
          where: { id: data.from },
        });
        const receiver = await this.prisma.user.findUnique({
          where: { id: data.to },
        });
        if (!sender || !receiver) {
          throw new HttpException(
            'Sender or receiver does not exist',
            HttpStatus.FORBIDDEN,
          );
        }
        //We compute the new balance of the sender and the receiver
        const newSenderBalance = sender.balance - data.amount;
        const newReceiverBalance = receiver.balance + data.amount;
        //We update the balance of the sender and the receiver with a prisma transaction
        await this.prisma.$transaction([
          this.prisma.user.update({
            where: { id: data.from },
            data: { balance: newSenderBalance },
          }),
          this.prisma.user.update({
            where: { id: data.to },
            data: { balance: newReceiverBalance },
          }),
        ]);
        break;
      case 'DEPOSIT':
        //If the transaction is a deposit, we check that the user is an admin
        if (!currentUser.role.includes('admin')) {
          throw new HttpException('You are not an admin', HttpStatus.FORBIDDEN);
        }
        //If the transaction is a deposit, we check that the sender is the same as the receiver
        if (data.from !== data.to) {
          throw new HttpException(
            'Sender and receiver must be the same',
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
        //If the transaction is a deposit, we check that the user is an admin
        if (!currentUser.role.includes('admin')) {
          throw new HttpException('You are not an admin', HttpStatus.FORBIDDEN);
        }
        //If the transaction is an expense, we check that the sender is a user and the receiver is -1
        if (data.to !== -1) {
          throw new HttpException('Receiver must be -1', HttpStatus.FORBIDDEN);
        }
        //We check that the sender is a user
        const user2 = await this.prisma.user.findUnique({
          where: { id: Number(data.from) },
        });
        if (!user2) {
          throw new HttpException(
            'Sender must be a user',
            HttpStatus.FORBIDDEN,
          );
        }
        //Compute the new balance of the user
        const newBalance2 = user2.balance - data.amount;
        //Update the balance of the user
        await this.prisma.user.update({
          where: { id: Number(data.from) },
          data: { balance: newBalance2 },
        });
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

  async addSgTransaction(transactions: Transaction[]): Promise<Transaction> {
    const data = transactions[0];
    return this.prisma.transaction.create({ data });
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
