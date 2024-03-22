import { ApiProperty } from "@nestjs/swagger";
import { PlanBorrowForm } from "@overbookd/logistic";
import { Type } from "class-transformer";
import { IsDate, IsOptional, IsString } from "class-validator";

export class PlanBorrowRequestDto implements PlanBorrowForm {
  @ApiProperty({
    type: String,
    description: "The lender's name",
    required: false,
  })
  @IsString()
  @IsOptional()
  lender: PlanBorrowForm["lender"];

  @ApiProperty({
    type: Date,
    description: "The date the gear is available",
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  availableOn: PlanBorrowForm["availableOn"];

  @ApiProperty({
    type: Date,
    description: "The date the gear is unavailable",
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  unavailableOn: PlanBorrowForm["unavailableOn"];
}
