import { TransactionType } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";
import {
  TransactionUser,
  TransactionWithSenderAndReceiver,
} from "@overbookd/personal-account";
import { TransactionUserResponseDto } from "./transaction-user.response.dto";
import { BaseTransactionResponseDto } from "./base-transaction.response.dto";

export class TransactionResponseDto
  extends BaseTransactionResponseDto
  implements TransactionWithSenderAndReceiver
{
  @ApiProperty()
  id: number;

  @ApiProperty({ enum: TransactionType })
  type: TransactionType;

  @ApiProperty({
    description: "Transaction sender",
    type: TransactionUserResponseDto,
    required: false,
  })
  payor?: TransactionUser;

  @ApiProperty({
    description: "Transaction receiver",
    type: TransactionUserResponseDto,
    required: false,
  })
  payee?: TransactionUser;

  @ApiProperty()
  isDeleted: boolean;
}
