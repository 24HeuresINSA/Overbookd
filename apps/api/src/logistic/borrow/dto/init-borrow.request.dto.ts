import { ApiProperty } from "@nestjs/swagger";
import { InitBorrowForm } from "@overbookd/logistic";
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class InitBorrowRequestDto implements InitBorrowForm {
  @ApiProperty({
    type: String,
    description: "The lender's name",
  })
  @IsString()
  @IsNotEmpty()
  lender: InitBorrowForm["lender"];

  @ApiProperty({
    type: Date,
    description: "The date the gear is available",
  })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  availableOn: InitBorrowForm["availableOn"];

  @ApiProperty({
    type: Date,
    description: "The date the gear is unavailable",
  })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  unavailableOn: InitBorrowForm["unavailableOn"];
}
