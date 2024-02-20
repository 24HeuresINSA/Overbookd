import { ApiProperty } from "@nestjs/swagger";
import type { CreateFestivalActivityForm } from "@overbookd/festival-event";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateFestivalActivityRequestDto
  implements CreateFestivalActivityForm
{
  @ApiProperty({
    description: "The festival activity name",
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
