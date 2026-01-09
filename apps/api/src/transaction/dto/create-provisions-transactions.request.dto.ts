import { ApiProperty } from "@nestjs/swagger";
import { CreateProvisionsTransactionsForm } from "@overbookd/http";
import { CreateProvisionsTransaction } from "@overbookd/personal-account";
import { IsDefined, IsNumber, Min } from "class-validator";

class CreateProvisionsTransactionDto implements CreateProvisionsTransaction {
  @ApiProperty({
    description: "The provisions' consumer",
  })
  @IsDefined()
  @IsNumber()
  consumer: number;

  @ApiProperty({
    description: "Number of sticks consumed",
    example: 10,
  })
  @IsDefined()
  @IsNumber()
  @Min(1)
  consumption: number;
}

export class CreateProvisionsTransactionsRequestDto implements CreateProvisionsTransactionsForm {
  @ApiProperty({
    description: "The stick price",
    example: 60,
  })
  @IsDefined()
  @IsNumber()
  @Min(1)
  stickPrice: number;

  @ApiProperty({
    description: "The transactions to create",
    type: CreateProvisionsTransactionDto,
    isArray: true,
  })
  @IsDefined()
  transactions: CreateProvisionsTransactionDto[];
}
