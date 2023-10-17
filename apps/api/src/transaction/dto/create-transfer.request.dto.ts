import { ApiProperty } from "@nestjs/swagger";
import { CreateTransferForm } from "@overbookd/personal-account";
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from "class-validator";

export class CreateTransferRequestDto implements CreateTransferForm {
  @ApiProperty({
    description: "The payee's id",
    type: Number,
  })
  @IsDefined()
  @IsNumber()
  to: number;

  @ApiProperty({
    description: "The amount to transfer",
    type: Number,
    example: 100,
  })
  @IsDefined()
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({
    description: "The transfer context",
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  context: string;
}
