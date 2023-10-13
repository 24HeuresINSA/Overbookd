import { ApiProperty } from "@nestjs/swagger";
import {
  BARREL,
  BarrelTransaction,
  DEPOSIT,
  DepositTransaction,
  PROVISIONS,
  ProvisionsTransaction,
  TRANSFER,
  TransferIReceiveTransaction,
  TransferISendTransaction,
} from "@overbookd/personal-account";

class BaseTransactionDto {
  @ApiProperty({
    description: "Transaction amount in cents",
    type: Number,
    example: 100,
  })
  amount: number;

  @ApiProperty({
    description: "Transaction context",
    type: String,
  })
  context: string;

  @ApiProperty({
    description: "Transaction date",
    type: Date,
  })
  date: Date;
}

export class DepositTransactionDto
  extends BaseTransactionDto
  implements DepositTransaction
{
  @ApiProperty({
    description: "Transaction type",
    type: DEPOSIT,
    example: DEPOSIT,
  })
  type: typeof DEPOSIT;
}

export class BarrelTransactionDto
  extends BaseTransactionDto
  implements BarrelTransaction
{
  @ApiProperty({
    description: "Transaction type",
    type: BARREL,
    example: BARREL,
  })
  type: typeof BARREL;
}

export class ProvisionsTransactionDto
  extends BaseTransactionDto
  implements ProvisionsTransaction
{
  @ApiProperty({
    description: "Transaction type",
    type: PROVISIONS,
    example: PROVISIONS,
  })
  type: typeof PROVISIONS;
}

export class TransferIReceiveTransactionDto
  extends BaseTransactionDto
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
    type: Number,
  })
  from: number;
}

export class TransferISendTransactionDto
  extends BaseTransactionDto
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
    type: Number,
  })
  to: number;
}
