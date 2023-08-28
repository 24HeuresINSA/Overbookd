import { ApiProperty } from "@nestjs/swagger";
import { Team } from "../team.model";

export class TeamResponseDto implements Team {
  @ApiProperty({
    name: "code",
    description: "The code of the team",
    type: String,
  })
  code: string;

  @ApiProperty({
    name: "name",
    description: "The name of the team",
    type: String,
  })
  name: string;

  @ApiProperty({
    name: "color",
    description: "The color of the team",
    type: String,
  })
  color: string;

  @ApiProperty({
    name: "icon",
    description: "The icon of the team",
    type: String,
  })
  icon: string;
}
