import { ApiProperty } from "@nestjs/swagger";
import { AddVolunteerToMobilizationForm } from "@overbookd/http";
import { IsNumber } from "class-validator";

export class AddVolunteerRequestDto implements AddVolunteerToMobilizationForm {
  @ApiProperty({
    description: "Volunteer id",
    type: Number,
  })
  @IsNumber()
  volunteerId: number;
}
