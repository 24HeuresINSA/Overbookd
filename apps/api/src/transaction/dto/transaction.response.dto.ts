import { TransactionType } from "@prisma/client";
import {
  TransactionUser,
  TransactionWithSenderAndReceiver,
} from "../transaction.service";
import { ApiProperty } from "@nestjs/swagger";

class UserRepresentation implements TransactionUser {
  id: number;
  firstname: string;
  lastname: string;
}

export class TransactionResponseDto
  implements TransactionWithSenderAndReceiver
{
  id: number;
  @ApiProperty({ enum: TransactionType })
  type: TransactionType;
  amount: number;
  context: string;
  createdAt: Date;
  isDeleted: boolean;
  @ApiProperty({ description: "Transaction sender", type: UserRepresentation })
  userFrom: TransactionUser;
  @ApiProperty({
    description: "Transaction receiver",
    type: UserRepresentation,
  })
  userTo: TransactionUser;
}
