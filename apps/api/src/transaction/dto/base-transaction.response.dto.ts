import { ApiProperty } from "@nestjs/swagger";

export class BaseTransactionResponseDto {
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
