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
  UseFilters,
} from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from "@nestjs/swagger";
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
import {
  CreateTransferForm,
  MyTransaction,
  TransactionWithSenderAndReceiver,
} from "@overbookd/personal-account";
import { CreateTransferRequestDto } from "./dto/create-transfer.request.dto";
import {
  MyBarrelTransactionResponseDto,
  MyDepositTransactionResponseDto,
  MyProvisionsTransactionResponseDto,
  TransferIReceiveTransactionResponseDto,
  TransferISendTransactionResponseDto,
} from "./dto/my-transaction.response.dto";
import { TransactionErrorFilter } from "./transaction-error.filter";
import { CreateDepositRequestDto } from "./dto/create-deposit.request.dto";
import { CreateBarrelTransactionsRequestDto } from "./dto/create-barrel-transactions.request.dto";
import { CreateProvisionsTransactionsRequestDto } from "./dto/create-provisions-transactions.request.dto";

@ApiBearerAuth()
@UseFilters(TransactionErrorFilter)
@ApiTags("transactions")
@Controller("transactions")
@ApiBadRequestResponse({ description: "Bad Request" })
@ApiForbiddenResponse({ description: "User can't access this resource" })
@ApiUnauthorizedResponse({
  description: "User don't have the right to access this route",
})
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
  @ApiExtraModels(
    MyDepositTransactionResponseDto,
    MyBarrelTransactionResponseDto,
    MyProvisionsTransactionResponseDto,
    TransferIReceiveTransactionResponseDto,
    TransferISendTransactionResponseDto,
  )
  @ApiResponse({
    status: 200,
    description: "Get all transactions of self",
    schema: {
      oneOf: [
        { $ref: getSchemaPath(MyDepositTransactionResponseDto) },
        { $ref: getSchemaPath(MyBarrelTransactionResponseDto) },
        { $ref: getSchemaPath(MyProvisionsTransactionResponseDto) },
        { $ref: getSchemaPath(TransferIReceiveTransactionResponseDto) },
        { $ref: getSchemaPath(TransferISendTransactionResponseDto) },
      ],
    },
  })
  getMyTransactions(
    @Request() request: RequestWithUserPayload,
  ): Promise<MyTransaction[]> {
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
  @ApiResponse({
    status: 204,
    description: "Create a transfer",
  })
  sendTransfer(
    @Body() transfer: CreateTransferForm,
    @Request() request: RequestWithUserPayload,
  ): Promise<void> {
    return this.transferService.send(transfer, request.user);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(MANAGE_PERSONAL_ACCOUNTS)
  @Post("deposits")
  @HttpCode(204)
  @ApiBody({
    description: "Deposits to create",
    type: CreateDepositRequestDto,
    isArray: true,
  })
  @ApiResponse({
    description: "Generated deposits",
    status: 204,
  })
  addDeposits(@Body() deposits: CreateDepositRequestDto[]): Promise<void> {
    return this.transactionService.addDeposits(deposits);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(MANAGE_PERSONAL_ACCOUNTS)
  @Post("barrels")
  @HttpCode(204)
  @ApiBody({
    description: "Barrel transactions to create",
    type: CreateBarrelTransactionsRequestDto,
  })
  @ApiResponse({
    description: "Created barrel transactions",
    status: 204,
  })
  addBarrelTransactions(
    @Body() { barrelSlug, transactions }: CreateBarrelTransactionsRequestDto,
  ): Promise<void> {
    return this.transactionService.addBarrelTransactions(
      barrelSlug,
      transactions,
    );
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(MANAGE_PERSONAL_ACCOUNTS)
  @Post("provisions")
  @HttpCode(204)
  @ApiBody({
    description: "Provisions transactions to create",
    type: CreateProvisionsTransactionsRequestDto,
  })
  @ApiResponse({
    description: "Created provisions transactions",
    status: 204,
  })
  addProvisionsTransactions(
    @Body()
    { stickPrice, transactions }: CreateProvisionsTransactionsRequestDto,
  ): Promise<void> {
    return this.transactionService.addProvisionsTransactions(
      stickPrice,
      transactions,
    );
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
