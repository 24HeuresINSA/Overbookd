import { ApiProperty } from "@nestjs/swagger";
import { CreateDepositForm } from "@overbookd/personal-account";
import { IsDefined, IsNumber, Min } from "class-validator";

export class CreateDepositRequestDto implements CreateDepositForm {
  @ApiProperty({
    description: "Deposit amount in cents",
    type: Number,
    example: 100,
  })
  @IsDefined()
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({
    description: "Depositor id",
    type: Number,
  })
  @IsDefined()
  @IsNumber()
  depositor: number;
}
