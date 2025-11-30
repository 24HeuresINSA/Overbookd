import { ApiProperty } from "@nestjs/swagger";
import { VolunteerCandidate } from "@overbookd/http";
import { RegistrationTeams } from "@overbookd/registration";
import type { IProvidePeriod } from "@overbookd/time";
import { PeriodResponseDto } from "../../../../common/dto/period.response.dto";
import { TECKOS } from "@overbookd/team-constants";

export class VolunteerCandidateResponseDto implements VolunteerCandidate {
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
    type: Date,
  })
  candidatedAt: Date;

  @ApiProperty({
    required: true,
    example: [TECKOS],
  })
  teams: RegistrationTeams;

  @ApiProperty({
    required: true,
    type: Number,
  })
  charisma: number;

  @ApiProperty({
    required: true,
    type: String,
  })
  mobilePhone: string;

  @ApiProperty({
    required: true,
    type: PeriodResponseDto,
    isArray: true,
  })
  availabilities: IProvidePeriod[];

  @ApiProperty({
    required: true,
    type: String,
  })
  birthdate: Date;

  @ApiProperty({
    required: false,
    type: String,
  })
  comment?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  note?: string;
}
