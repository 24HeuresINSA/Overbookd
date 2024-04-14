import { ApiProperty } from "@nestjs/swagger";
import { InitPurchaseForm } from "@overbookd/logistic";
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class InitPurchaseRequestDto implements InitPurchaseForm {
  @ApiProperty({
    type: String,
    description: "The seller's name",
  })
  @IsString()
  @IsNotEmpty()
  seller: InitPurchaseForm["seller"];

  @ApiProperty({
    type: Date,
    description: "The date the gear is available",
  })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  availableOn: InitPurchaseForm["availableOn"];
}
