import { ApiProperty } from "@nestjs/swagger";
import { AddBorrowGearRequestForm } from "@overbookd/http";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AddGearRequestDto implements AddBorrowGearRequestForm {
  @ApiProperty({
    type: String,
    description: "The name of the gear",
  })
  @IsString()
  @IsNotEmpty()
  slug: AddBorrowGearRequestForm["slug"];

  @ApiProperty({
    type: Number,
    description: "The quantity of the gear",
  })
  @IsNumber()
  @IsNotEmpty()
  quantity: AddBorrowGearRequestForm["quantity"];
}
