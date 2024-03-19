import { ApiProperty } from "@nestjs/swagger";
import { PlanBorrowForm } from "@overbookd/logistic";
import { IsDateString, IsOptional, IsString } from "class-validator";

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
    type: String,
    description: "The date the gear is available",
    required: false,
  })
  @IsDateString()
  @IsOptional()
  availableOn: PlanBorrowForm["availableOn"];

  @ApiProperty({
    type: String,
    description: "The date the gear is unavailable",
    required: false,
  })
  @IsDateString()
  @IsOptional()
  unavailableOn: PlanBorrowForm["unavailableOn"];
}
