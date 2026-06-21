import { ApiProperty } from "@nestjs/swagger";
import { Adherent } from "@overbookd/contribution";

export class ContributionAdherentResponseDto implements Adherent {
  @ApiProperty({
    description: "Adherent id",
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: "Adherent first name",
    type: String,
  })
  firstName: string;

  @ApiProperty({
    description: "Adherent last name",
    type: String,
  })
  lastName: string;

  @ApiProperty({
    description: "Adherent nickname",
    type: String,
    required: false,
  })
  nickname?: string;

  @ApiProperty({
    description: "Adherent email",
    type: String,
  })
  email: string;

  @ApiProperty({
    description: "Adherent teams",
    type: String,
    isArray: true,
  })
  teams: string[];
}
