import { ApiProperty } from "@nestjs/swagger";
import { CreateBarrelTransactionsForm } from "@overbookd/http";
import { CreateBarrelTransaction } from "@overbookd/personal-account";
import { IsDefined, IsNumber, IsString, Min } from "class-validator";

class CreateBarrelTransactionDto implements CreateBarrelTransaction {
  @ApiProperty({
    description: "The barrel's consumer",
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

export class CreateBarrelTransactionsRequestDto implements CreateBarrelTransactionsForm {
  @ApiProperty({
    description: "The barrel slug",
    example: "blonde",
  })
  @IsDefined()
  @IsString()
  barrelSlug: string;

  @ApiProperty({
    description: "The transactions to create",
    type: CreateBarrelTransactionDto,
    isArray: true,
  })
  @IsDefined()
  transactions: CreateBarrelTransactionDto[];
}
