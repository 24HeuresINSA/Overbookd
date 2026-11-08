import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";
import { CreateOverClicScoreForm } from "@overbookd/volunteer-availability";

export class CreateOverClicScoreRequestDto implements CreateOverClicScoreForm {
  @ApiProperty({
    required: true,
    description: "The score achieved on OverClic",
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  score: number;
}
