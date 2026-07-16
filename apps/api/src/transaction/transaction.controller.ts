import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  ParseIntPipe,
  HttpCode,
  UseFilters,
} from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from "@nestjs/swagger";
import { Permissions } from "../authentication-zitadel/decorators/permissions-auth.decorator";
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
  MyExternalEventTransactionResponseDto,
  MyNegativeInitializationTransactionResponseDto,
  MyPositiveInitializationTransactionResponseDto,
  MyProvisionsTransactionResponseDto,
  TransferIReceiveTransactionResponseDto,
  TransferISendTransactionResponseDto,
} from "./dto/my-transaction.response.dto";
import { TransactionErrorFilter } from "./transaction-error.filter";
import { CreateDepositRequestDto } from "./dto/create-deposit.request.dto";
import { CreateBarrelTransactionsRequestDto } from "./dto/create-barrel-transactions.request.dto";
import { CreateProvisionsTransactionsRequestDto } from "./dto/create-provisions-transactions.request.dto";
import { CreateExternalEventTransactionsRequestDto } from "./dto/create-external-event-transactions.request.dto";
import { ApiSwaggerResponse } from "../api-swagger-response.decorator";
import { RequestHydratedUser } from "../authentication-zitadel/request-hydrated-user";
import { AuthenticatedUser } from "../authentication-zitadel/decorators/authenticated-user.decorator";

@Controller("transactions")
@ApiTags("transactions")
@UseFilters(TransactionErrorFilter)
@ApiBearerAuth()
@ApiSwaggerResponse()
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly transferService: TransferService,
  ) {}

  @Get()
  @Permissions(MANAGE_PERSONAL_ACCOUNTS)
  @ApiResponse({
    status: 200,
    description: "Get all transactions",
    isArray: true,
    type: TransactionResponseDto,
  })
  getAllTransactions(): Promise<TransactionWithSenderAndReceiver[]> {
    return this.transactionService.getAllTransactions();
  }

  @Get("me")
  @Permissions(HAVE_PERSONAL_ACCOUNT)
  @ApiExtraModels(
    MyDepositTransactionResponseDto,
    MyBarrelTransactionResponseDto,
    MyProvisionsTransactionResponseDto,
    MyExternalEventTransactionResponseDto,
    TransferIReceiveTransactionResponseDto,
    TransferISendTransactionResponseDto,
    MyPositiveInitializationTransactionResponseDto,
    MyNegativeInitializationTransactionResponseDto,
  )
  @ApiResponse({
    status: 200,
    description: "Get all transactions of self",
    schema: {
      oneOf: [
        { $ref: getSchemaPath(MyDepositTransactionResponseDto) },
        { $ref: getSchemaPath(MyBarrelTransactionResponseDto) },
        { $ref: getSchemaPath(MyProvisionsTransactionResponseDto) },
        { $ref: getSchemaPath(MyExternalEventTransactionResponseDto) },
        { $ref: getSchemaPath(TransferIReceiveTransactionResponseDto) },
        { $ref: getSchemaPath(TransferISendTransactionResponseDto) },
        { $ref: getSchemaPath(MyPositiveInitializationTransactionResponseDto) },
        { $ref: getSchemaPath(MyNegativeInitializationTransactionResponseDto) },
      ],
    },
  })
  getMyTransactions(
    @AuthenticatedUser() user: RequestHydratedUser,
  ): Promise<MyTransaction[]> {
    return this.transactionService.getMyTransactions(user.id);
  }

  @Post("transfer")
  @Permissions(HAVE_PERSONAL_ACCOUNT)
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
    @AuthenticatedUser() user: RequestHydratedUser,
  ): Promise<void> {
    return this.transferService.send(transfer, user);
  }

  @Post("deposits")
  @Permissions(MANAGE_PERSONAL_ACCOUNTS)
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

  @Post("barrels")
  @Permissions(MANAGE_PERSONAL_ACCOUNTS)
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

  @Post("provisions")
  @Permissions(MANAGE_PERSONAL_ACCOUNTS)
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

  @Post("external-event")
  @Permissions(MANAGE_PERSONAL_ACCOUNTS)
  @HttpCode(204)
  @ApiBody({
    description: "External event transactions to create",
    type: CreateExternalEventTransactionsRequestDto,
    isArray: true,
  })
  @ApiResponse({
    description: "Created external events transactions",
    status: 204,
  })
  addExternalEventTransactions(
    @Body()
    consumptions: CreateExternalEventTransactionsRequestDto[],
  ): Promise<void> {
    return this.transactionService.addExternalEventTransactions(consumptions);
  }

  @Delete(":id")
  @Permissions(MANAGE_PERSONAL_ACCOUNTS)
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Delete a transaction by id",
  })
  deleteTransaction(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.transactionService.deleteTransaction(id);
  }
}
