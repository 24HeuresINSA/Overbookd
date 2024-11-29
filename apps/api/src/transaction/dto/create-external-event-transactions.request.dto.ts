import { ApiProperty } from "@nestjs/swagger";
import { NewExternalEventConsumption } from "@overbookd/personal-account";
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from "class-validator";

export class CreateExternalEventTransactionsRequestDto
  implements NewExternalEventConsumption
{
  @ApiProperty({
    description: "External event amount in cents",
    type: Number,
    example: 100,
  })
  @IsDefined()
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({
    description: "Consumer id",
    type: Number,
  })
  @IsDefined()
  @IsNumber()
  consumer: number;

  @ApiProperty({
    description: "External event context",
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  context: string;
}
