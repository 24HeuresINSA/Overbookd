import {
  Conflicts,
  FestivalTaskLink,
  VolunteerWithConflicts,
} from "@overbookd/festival-event";
import { ApiProperty } from "@nestjs/swagger";
import { AdherentResponseDto } from "../../../common/dto/adherent.response.dto";

class FestivalTaskLinkDto implements FestivalTaskLink {
  @ApiProperty({})
  id: FestivalTaskLink["id"];

  @ApiProperty({})
  name: FestivalTaskLink["name"];
}

class ConflictsDto implements Conflicts {
  @ApiProperty({ type: FestivalTaskLinkDto, isArray: true })
  tasks: FestivalTaskLink[];

  @ApiProperty({})
  availability: boolean;
}

export class VolunteerWithConflictsResponseDto
  extends AdherentResponseDto
  implements VolunteerWithConflicts
{
  @ApiProperty({ type: ConflictsDto })
  conflicts: Conflicts;
}
