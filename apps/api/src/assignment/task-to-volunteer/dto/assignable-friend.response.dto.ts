import { ApiProperty } from "@nestjs/swagger";
import { VolunteerForFunnel } from "@overbookd/assignment";

export class AvailableFriendResponseDto implements VolunteerForFunnel {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  firstname: string;

  @ApiProperty({ type: String })
  lastname: string;

  @ApiProperty({ type: String, isArray: true })
  teams: string[];
}
