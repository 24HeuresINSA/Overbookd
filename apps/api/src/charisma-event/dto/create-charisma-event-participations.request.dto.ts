import { ApiProperty } from "@nestjs/swagger";
import {
  CharismaEventDefinition,
  ParticipantTakingPartInCharismaEvent,
} from "@overbookd/charisma";
import { CreateCharismaEventParticipationsForm } from "@overbookd/http";
import { Type } from "class-transformer";
import {
  IsDate,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from "class-validator";

class CharismaEventDefinitionDto implements CharismaEventDefinition {
  @ApiProperty({ example: "Comptage vélo #1" })
  @IsString()
  @IsDefined()
  name: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(1)
  charismaPerHour: number;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  eventDate: Date;
}

class ParticipantTakingPartInCharismaEventDto
  implements ParticipantTakingPartInCharismaEvent
{
  @ApiProperty()
  @IsNumber()
  @IsDefined()
  id: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  hours: number;
}

export class CreateCharismaEventParticipationsRequestDto
  implements CreateCharismaEventParticipationsForm
{
  @ApiProperty({ type: CharismaEventDefinitionDto })
  @IsDefined()
  event: CharismaEventDefinition;

  @ApiProperty({
    type: ParticipantTakingPartInCharismaEventDto,
    isArray: true,
  })
  participants: ParticipantTakingPartInCharismaEvent[];
}
