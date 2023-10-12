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
} from "@nestjs/common";
import {
  TransactionService,
  TransactionWithSenderAndReceiver,
} from "./transaction.service";
import { Transaction } from "@prisma/client";
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateTransactionRequestDto } from "./dto/create-transaction.request.dto";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import { Permission } from "../authentication/permissions-auth.decorator";
import { RequestWithUserPayload } from "../../src/app.controller";
import { TransactionResponseDto } from "./dto/transaction.response.dto";
import {
  HAVE_PERSONAL_ACCOUNT,
  MANAGE_PERSONAL_ACCOUNTS,
} from "@overbookd/permission";
import { TransferService } from "./transfer.service";
import { CreateTransferForm } from "@overbookd/personal-account";
import { CreateTransferRequestDto } from "./dto/create-transfer.request.dto";

@ApiBearerAuth()
@ApiTags("transactions")
@Controller("transactions")
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly transferService: TransferService,
  ) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(MANAGE_PERSONAL_ACCOUNTS)
  @Get()
  @ApiResponse({
    status: 200,
    description: "Get all transactions",
    isArray: true,
    type: TransactionResponseDto,
  })
  getAllTransactions(): Promise<TransactionWithSenderAndReceiver[]> {
    return this.transactionService.getAllTransactions();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(HAVE_PERSONAL_ACCOUNT)
  @Get("me")
  @ApiResponse({
    status: 200,
    description: "Get all transactions of self",
    type: TransactionResponseDto,
    isArray: true,
  })
  getMyTransactions(
    @Request() request: RequestWithUserPayload,
  ): Promise<TransactionWithSenderAndReceiver[]> {
    return this.transactionService.getMyTransactions(request.user);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(HAVE_PERSONAL_ACCOUNT)
  @Post("transfer")
  @HttpCode(204)
  @ApiBody({
    description: "transfer to create",
    type: CreateTransferRequestDto,
  })
  sendTransfer(
    @Body() transfer: CreateTransferForm,
    @Request() request: RequestWithUserPayload,
  ): Promise<void> {
    return this.transferService.send(transfer, request.user);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(MANAGE_PERSONAL_ACCOUNTS)
  @Post("sg")
  @ApiBody({
    description: "transactions to generate",
    isArray: true,
    type: CreateTransactionRequestDto,
  })
  @ApiResponse({
    description: "generated transactions",
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
  @Permission(MANAGE_PERSONAL_ACCOUNTS)
  @HttpCode(204)
  @Delete(":id")
  @ApiResponse({
    status: 204,
    description: "Delete a transaction by id",
  })
  deleteTransaction(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.transactionService.deleteTransaction(id);
  }
}
