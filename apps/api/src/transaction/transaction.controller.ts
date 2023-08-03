import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
  HttpCode,
} from '@nestjs/common';
import {
  TransactionService,
  TransactionWithSenderAndReceiver,
} from './transaction.service';
import { Transaction } from '@prisma/client';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTransactionRequestDto } from './dto/create-transaction.request.dto';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { PermissionsGuard } from '../authentication/permissions-auth.guard';
import { Permission } from '../authentication/permissions-auth.decorator';
import { RequestWithUserPayload } from '../../src/app.controller';
import { TransactionResponseDto } from './dto/transaction.response.dto';

@ApiBearerAuth()
@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('manage-cp')
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all transactions',
    isArray: true,
    type: TransactionResponseDto,
  })
  getAllTransactions(): Promise<TransactionWithSenderAndReceiver[]> {
    return this.transactionService.getAllTransactions();
  }

  @UseGuards(JwtAuthGuard)
  @Permission('manage-cp')
  @Get('user/:id')
  @ApiResponse({
    status: 200,
    description: 'Get all transactions of a user',
    type: TransactionResponseDto,
    isArray: true,
  })
  getUserTransactions(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TransactionWithSenderAndReceiver[]> {
    return this.transactionService.getUserTransactions(id);
  }

  @UseGuards(JwtAuthGuard)
  @Permission('cp')
  @Get('me')
  @ApiResponse({
    status: 200,
    description: 'Get all transactions of self',
    type: TransactionResponseDto,
    isArray: true,
  })
  getMyTransactions(
    @Request() request: RequestWithUserPayload,
  ): Promise<TransactionWithSenderAndReceiver[]> {
    const { userId } = request.user;
    return this.transactionService.getUserTransactions(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Permission('cp')
  @Get('/:id')
  @ApiResponse({
    status: 200,
    description: 'Get a transaction by id',
    type: TransactionResponseDto,
  })
  getTransactionById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TransactionWithSenderAndReceiver | null> {
    return this.transactionService.getTransactionById(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('cp')
  @Post('transfer')
  @ApiBody({
    description: 'Create a transaction',
    type: CreateTransactionRequestDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Generated transaction',
    type: TransactionResponseDto,
  })
  createTransaction(
    @Body() transactionData: Transaction,
    @Request() request: RequestWithUserPayload,
  ): Promise<TransactionWithSenderAndReceiver> {
    const { userId } = request.user;
    return this.transactionService.createTransaction(transactionData, userId);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('manage-cp')
  @Post('sg')
  @ApiBody({
    description: 'transactions to generate',
    isArray: true,
    type: CreateTransactionRequestDto,
  })
  @ApiResponse({
    description: 'generated transactions',
    status: 201,
    type: TransactionResponseDto,
    isArray: true,
  })
  addSgTransaction(
    @Body() transactionData: Transaction[],
  ): Promise<TransactionWithSenderAndReceiver[]> {
    return this.transactionService.addSgTransaction(transactionData);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('manage-cp')
  @HttpCode(204)
  @Delete(':id')
  @ApiResponse({
    status: 204,
    description: 'Delete a transaction by id',
  })
  deleteTransaction(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.transactionService.deleteTransaction(id);
  }
}
