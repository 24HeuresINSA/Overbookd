import { ApiProperty } from "@nestjs/swagger";
import { EditAmountForm } from "@overbookd/http";
import { IsDefined, IsNumber } from "class-validator";

export class EditAmountRequestDto implements EditAmountForm {
  @ApiProperty({
    description: "The amount",
    example: 100,
    type: Number,
  })
  @IsDefined()
  @IsNumber()
  amount: EditAmountForm["amount"];
}
