import { ApiProperty } from "@nestjs/swagger";
import { StaffCandidate } from "@overbookd/http";
import { Teams, TECKOS_CODE } from "@overbookd/registration";

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
  firstname: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  lastname: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  email: string;

  @ApiProperty({
    required: true,
    example: [TECKOS_CODE],
  })
  teams: Teams;
}
