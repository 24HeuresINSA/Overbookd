import { ApiProperty } from "@nestjs/swagger";
import { InitInChargeForm } from "@overbookd/http";
import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class InitInChargeRequestDto implements InitInChargeForm {
  @ApiProperty({
    type: [Number],
    description: "The list of volunteer ids to be in charge",
  })
  @IsArray()
  @IsNotEmpty()
  volunteers: number[];

  @ApiProperty({
    type: String,
    description: "The instruction for the in charge volunteers",
  })
  @IsString()
  @IsNotEmpty()
  instruction: string;
}
