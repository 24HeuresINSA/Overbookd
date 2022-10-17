import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Transaction } from '@prisma/client';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransactionCreationDto } from './dto/transactionCreation.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/team-auth.guard';
import { Roles } from 'src/auth/team-auth.decorator';

@ApiBearerAuth()
@ApiTags('transaction')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all transactions',
    type: Array,
  })
  getAllTransactions(): Promise<Transaction[]> {
    return this.transactionService.getAllTransactions();
  }

  @UseGuards(JwtAuthGuard)
  @Roles('hard')
  @Get('user/:id')
  @ApiResponse({
    status: 200,
    description: 'Get all transactions of a user',
    type: Array,
  })
  getUserTransactionsID(
    @Param('id') id: number,
  ): Promise<Transaction[] | null> {
    return this.transactionService.getUserTransactions(id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('hard')
  @Get('user')
  @ApiResponse({
    status: 200,
    description: 'Get all transactions of self',
    type: Array,
  })
  getUserTransactions(
    @Request() req: Express.Request,
  ): Promise<Transaction[] | null> {
    const id = (req.user as any).userId; //C'est moche mais c'est la faute de NestJS
    return this.transactionService.getUserTransactions(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  @ApiResponse({
    status: 200,
    description: 'Get a transaction by id',
  })
  getTransactionById(@Param('id') id: number): Promise<Transaction | null> {
    console.log('Hello');
    return this.transactionService.getTransactionById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hard')
  @Post('transfer')
  @ApiBody({
    description: 'Create a transaction',
    type: TransactionCreationDto,
  })
  createTransaction(
    @Body() transactionData: Transaction,
    @Request() req: Express.Request,
  ): Promise<Transaction> {
    return this.transactionService.createTransaction(transactionData, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('sg')
  addSgTransaction(
    @Body() transactionData: Transaction[],
  ): Promise<Transaction[]> {
    return this.transactionService.addSgTransaction(transactionData);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Delete a transaction by id',
  })
  deleteTransaction(@Param('id') id: number): Promise<Transaction> {
    return this.transactionService.deleteTransaction(id);
  }
}
