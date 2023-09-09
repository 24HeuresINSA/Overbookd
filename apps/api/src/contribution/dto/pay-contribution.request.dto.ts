import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNumber } from "class-validator";
import { PayContributionForm } from "@overbookd/contribution";

export class PayContributionRequestDto implements PayContributionForm {
  @ApiProperty({
    description: "The user id",
    type: Number,
  })
  @IsDefined()
  @IsNumber()
  userId: number;

  @ApiProperty({
    description: "The amount to pay",
    example: 100,
    type: Number,
  })
  @IsDefined()
  @IsNumber()
  amount: number;
}
