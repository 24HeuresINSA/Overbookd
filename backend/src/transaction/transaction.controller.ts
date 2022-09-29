import { Body, Controller, Get, Param, Post, Delete } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Transaction } from '@prisma/client';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  getAllTransactions(): Promise<Transaction[]> {
    return this.transactionService.getAllTransactions();
  }

  @Get(':id')
  getTransactionById(@Param('id') id: number): Promise<Transaction | null> {
    return this.transactionService.getTransactionById(id);
  }

  @Get('user/:id')
  getUserTransactions(@Param('id') id: number): Promise<Transaction[] | null> {
    return this.transactionService.getUserTransactions(id);
  }

  @Post()
  createTransaction(
    @Body() transactionData: Transaction,
  ): Promise<Transaction> {
    return this.transactionService.createTransaction(transactionData);
  }

  @Delete(':id')
  deleteTransaction(@Param('id') id: number): Promise<Transaction> {
    return this.transactionService.deleteTransaction(id);
  }
}
