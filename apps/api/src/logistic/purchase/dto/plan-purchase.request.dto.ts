import { ApiProperty } from "@nestjs/swagger";
import { PlanPurchaseForm } from "@overbookd/logistic";
import { Type } from "class-transformer";
import { IsDate, IsOptional, IsString } from "class-validator";

export class PlanPurchaseRequestDto implements PlanPurchaseForm {
  @ApiProperty({
    type: String,
    description: "The seller's name",
    required: false,
  })
  @IsString()
  @IsOptional()
  seller: PlanPurchaseForm["seller"];

  @ApiProperty({
    type: Date,
    description: "The date the gear is available",
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  availableOn: PlanPurchaseForm["availableOn"];
}
