import { ApiProperty } from "@nestjs/swagger";
import { AddGearRequestForm } from "@overbookd/http";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AddGearRequestDto implements AddGearRequestForm {
  @ApiProperty({
    type: String,
    description: "The name of the gear",
  })
  @IsString()
  @IsNotEmpty()
  slug: AddGearRequestForm["slug"];

  @ApiProperty({
    type: Number,
    description: "The quantity of the gear",
  })
  @IsNumber()
  @IsNotEmpty()
  quantity: AddGearRequestForm["quantity"];
}
