import { ApiProperty } from "@nestjs/swagger";
import { StaffCandidate } from "@overbookd/http";
import { RegistrationTeams } from "@overbookd/registration";
import { TECKOS } from "@overbookd/team-constants";

export class StaffCandidateResponseDto implements StaffCandidate {
  @ApiProperty({
    required: true,
    type: Number,
  })
  id: number;

  @ApiProperty({
    required: true,
    type: String,
  })
  firstName: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  lastName: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  email: string;

  @ApiProperty({
    required: true,
    type: Date,
  })
  candidatedAt: Date;

  @ApiProperty({
    required: true,
    example: [TECKOS],
  })
  teams: RegistrationTeams;
}
