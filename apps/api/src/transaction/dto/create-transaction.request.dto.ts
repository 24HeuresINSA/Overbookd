import { ApiProperty } from "@nestjs/swagger";
import { CreateTransactionForm } from "@overbookd/http";

enum TransactionType {
  DEPOSIT = "DEPOSIT",
  BARREL = "BARREL",
  PROVISIONS = "PROVISIONS",
}

export class CreateTransactionRequestDto implements CreateTransactionForm {
  @ApiProperty({
    required: true,
    description: "The type of the transaction",
  })
  type: TransactionType;

  @ApiProperty({
    required: true,
    description: "The amount of the transaction",
    default: 0,
  })
  amount: number;

  @ApiProperty({
    required: false,
    description: "The description of the transaction",
  })
  context: string;

  @ApiProperty({
    required: true,
    description: "The id of the payee",
  })
  from: number;

  @ApiProperty({
    required: true,
    description: "The id of the payor",
  })
  to: number;
}
