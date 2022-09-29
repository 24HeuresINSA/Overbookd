import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Transaction, Prisma } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async getAllTransactions(): Promise<Transaction[]> {
    return this.prisma.transaction.findMany();
  }

  async getTransactionById(id: number): Promise<Transaction | null> {
    return this.prisma.transaction.findUnique({ where: { id: Number(id) } });
  }

  async createTransaction(
    data: Prisma.TransactionCreateInput,
  ): Promise<Transaction> {
    return this.prisma.transaction.create({ data });
  }

  async deleteTransaction(id: number): Promise<Transaction> {
    return this.prisma.transaction.delete({ where: { id: Number(id) } });
  }
}
