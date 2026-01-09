import { ApiProperty } from "@nestjs/swagger";
import { EditCharismaEventParticipation } from "@overbookd/charisma";
import { IsNumber, Min } from "class-validator";

export class EditCharismaEventParticipationRequestDto implements Pick<
  EditCharismaEventParticipation,
  "charisma"
> {
  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(1)
  charisma: number;
}
