import { ApiProperty } from "@nestjs/swagger";
import { UpdateInChargeVolunteersForm } from "@overbookd/http";
import { IsArray } from "class-validator";

export class UpdateInChargeVolunteersRequestDto
  implements UpdateInChargeVolunteersForm
{
  @ApiProperty({
    description: "Id of the volunteers in charge",
    isArray: true,
    type: Number,
  })
  @IsArray()
  volunteersId: UpdateInChargeVolunteersForm["volunteersId"];
}
