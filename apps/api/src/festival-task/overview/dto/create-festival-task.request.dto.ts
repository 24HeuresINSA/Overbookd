import { ApiProperty } from "@nestjs/swagger";
import { FestivalTaskCreationForm } from "@overbookd/http";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateFestivalTaskRequestDto implements FestivalTaskCreationForm {
  @ApiProperty({
    description: "The festival task name",
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: "The festival activity id",
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  festivalActivityId: number;
}
