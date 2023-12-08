import { TransactionType } from "@prisma/client";
import { TransactionWithSenderAndReceiver } from "../transaction.service";
import { ApiProperty } from "@nestjs/swagger";
import { TransactionUser } from "@overbookd/personal-account";

export class UserRepresentation implements TransactionUser {
  id: number;
  firstname: string;
  lastname: string;
  nickname?: string;
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
  payor: TransactionUser;
  @ApiProperty({
    description: "Transaction receiver",
    type: UserRepresentation,
  })
  payee: TransactionUser;
}
