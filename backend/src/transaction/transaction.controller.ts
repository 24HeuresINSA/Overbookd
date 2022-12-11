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
import { TransactionCreationDto } from './dto/transactionCreation.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/permissions-auth.guard';
import { Permissions } from 'src/auth/permissions-auth.decorator';
import { RequestWithUserPayload } from 'src/app.controller';

@ApiBearerAuth()
@ApiTags('transaction')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('manage-cp')
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all transactions',
    type: Array,
  })
  getAllTransactions(): Promise<TransactionWithSenderAndReceiver[]> {
    return this.transactionService.getAllTransactions();
  }

  @UseGuards(JwtAuthGuard)
  @Permissions('manage-cp')
  @Get('user/:id')
  @ApiResponse({
    status: 200,
    description: 'Get all transactions of a user',
    type: Array,
  })
  getUserTransactions(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TransactionWithSenderAndReceiver[] | null> {
    return this.transactionService.getUserTransactions(id);
  }

  @UseGuards(JwtAuthGuard)
  @Permissions('cp')
  @Get('me')
  @ApiResponse({
    status: 200,
    description: 'Get all transactions of self',
    type: Array,
  })
  getMyTransactions(
    @Request() request: RequestWithUserPayload,
  ): Promise<TransactionWithSenderAndReceiver[] | null> {
    const { userId } = request.user;
    return this.transactionService.getUserTransactions(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Permissions('cp')
  @Get('/:id')
  @ApiResponse({
    status: 200,
    description: 'Get a transaction by id',
  })
  getTransactionById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TransactionWithSenderAndReceiver | null> {
    return this.transactionService.getTransactionById(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('cp')
  @Post('transfer')
  @ApiBody({
    description: 'Create a transaction',
    type: TransactionCreationDto,
  })
  createTransaction(
    @Body() transactionData: Transaction,
    @Request() request: RequestWithUserPayload,
  ): Promise<TransactionWithSenderAndReceiver> {
    const { userId } = request.user;
    return this.transactionService.createTransaction(transactionData, userId);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('manage-cp')
  @Post('sg')
  addSgTransaction(
    @Body() transactionData: Transaction[],
  ): Promise<TransactionWithSenderAndReceiver[]> {
    return this.transactionService.addSgTransaction(transactionData);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('manage-cp')
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
