import { ApiProperty } from "@nestjs/swagger";
import { EnrollableAdherent, EnrollableVolunteer } from "@overbookd/http";
import { IProvidePeriod } from "@overbookd/period";
import { Teams } from "@overbookd/registration";
import { PeriodDto } from "../../volunteer-availability/dto/period.dto";

export class EnrollableAdherentResponseDto implements EnrollableAdherent {
  @ApiProperty({
    required: true,
    description: "The newcomer id",
    type: Number,
  })
  id: number;

  @ApiProperty({
    required: true,
    description: "The newcomer firstname",
    type: String,
  })
  firstname: string;

  @ApiProperty({
    required: true,
    description: "The newcomer lastname",
    type: String,
  })
  lastname: string;

  @ApiProperty({
    required: true,
    description: "The newcomer email",
    type: String,
  })
  email: string;

  @ApiProperty({
    required: true,
    description: "The newcomer register date",
    type: Date,
  })
  registeredAt: Date;

  @ApiProperty({
    required: true,
    description: "The newcomer teams",
    example: ["teckos"],
  })
  teams: Teams;
}

export class EnrollableVolunteerResponseDto
  extends EnrollableAdherentResponseDto
  implements EnrollableVolunteer
{
  @ApiProperty({ required: true })
  charisma: number;

  @ApiProperty({ required: true })
  mobilePhone: string;

  @ApiProperty({ required: true, isArray: true, type: PeriodDto })
  availabilities: IProvidePeriod[];

  @ApiProperty({ required: false })
  comment?: string;

  @ApiProperty({ required: true, type: Date })
  birthdate: Date;
}
