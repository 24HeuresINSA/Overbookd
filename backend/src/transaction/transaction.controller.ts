import { Body, Controller, Get, Param, Post, Delete } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Transaction } from '@prisma/client';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransactionCreationDto } from './dto/transactionCreation.dto';

@ApiBearerAuth()
@ApiTags('transaction')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all transactions',
    type: Array,
  })
  getAllTransactions(): Promise<Transaction[]> {
    return this.transactionService.getAllTransactions();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Get a transaction by id',
  })
  getTransactionById(@Param('id') id: number): Promise<Transaction | null> {
    return this.transactionService.getTransactionById(id);
  }

  @Get('user/:id')
  @ApiResponse({
    status: 200,
    description: 'Get all transactions of a user',
    type: Array,
  })
  getUserTransactions(@Param('id') id: number): Promise<Transaction[] | null> {
    return this.transactionService.getUserTransactions(id);
  }

  @Post()
  @ApiBody({
    description: 'Create a transaction',
    type: TransactionCreationDto,
  })
  createTransaction(
    @Body() transactionData: Transaction,
  ): Promise<Transaction> {
    return this.transactionService.createTransaction(transactionData);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Delete a transaction by id',
  })
  deleteTransaction(@Param('id') id: number): Promise<Transaction> {
    return this.transactionService.deleteTransaction(id);
  }
}
