import { ApiProperty } from "@nestjs/swagger";
import { Volunteer } from "@overbookd/festival-event";
import { AddInChargeVolunteerForm } from "@overbookd/http";
import { IsNumber } from "class-validator";

export class AddInChargeVolunteerRequestDto
  implements AddInChargeVolunteerForm
{
  @ApiProperty({
    description: "Id of the volunteer in charge to add",
    type: Number,
  })
  @IsNumber()
  volunteerId: Volunteer["id"];
}
