import { ApiProperty } from "@nestjs/swagger";
import {
  BARREL,
  MyBarrelTransaction,
  DEPOSIT,
  MyDepositTransaction,
  PROVISIONS,
  MyProvisionsTransaction,
  TRANSFER,
  TransactionUser,
  TransferIReceiveTransaction,
  TransferISendTransaction,
} from "@overbookd/personal-account";
import { TransactionUserResponseDto } from "./transaction-user.response.dto";
import { BaseTransactionResponseDto } from "./base-transaction.response.dto";

export class MyDepositTransactionResponseDto
  extends BaseTransactionResponseDto
  implements MyDepositTransaction
{
  @ApiProperty({
    description: "Transaction type",
    type: DEPOSIT,
    example: DEPOSIT,
  })
  type: typeof DEPOSIT;
}

export class MyBarrelTransactionResponseDto
  extends BaseTransactionResponseDto
  implements MyBarrelTransaction
{
  @ApiProperty({
    description: "Transaction type",
    type: BARREL,
    example: BARREL,
  })
  type: typeof BARREL;
}

export class MyProvisionsTransactionResponseDto
  extends BaseTransactionResponseDto
  implements MyProvisionsTransaction
{
  @ApiProperty({
    description: "Transaction type",
    type: PROVISIONS,
    example: PROVISIONS,
  })
  type: typeof PROVISIONS;
}

export class TransferIReceiveTransactionResponseDto
  extends BaseTransactionResponseDto
  implements TransferIReceiveTransaction
{
  @ApiProperty({
    description: "Transaction type",
    type: TRANSFER,
    example: TRANSFER,
  })
  type: typeof TRANSFER;

  @ApiProperty({
    description: "Transaction sender",
    type: TransactionUserResponseDto,
  })
  from: TransactionUser;
}

export class TransferISendTransactionResponseDto
  extends BaseTransactionResponseDto
  implements TransferISendTransaction
{
  @ApiProperty({
    description: "Transaction type",
    type: TRANSFER,
    example: TRANSFER,
  })
  type: typeof TRANSFER;

  @ApiProperty({
    description: "Transaction reveiver",
    type: TransactionUserResponseDto,
  })
  to: TransactionUser;
}
