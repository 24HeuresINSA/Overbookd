import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { VolunteerAssignmentRequest } from '../assignment.service';
import { Type } from 'class-transformer';

class VolunteerAssignmentRequestDto implements VolunteerAssignmentRequest {
  @ApiProperty({
    required: true,
    description: 'The id of the volunteer',
    type: Number,
  })
  @IsNumber()
  @IsPositive()
  id: number;

  @ApiProperty({
    required: true,
    description: 'The team code volunteer will be assigned as',
    type: String,
  })
  @IsString()
  teamCode: string;
}

export class AssignmentRequestDto {
  @ApiProperty({
    required: true,
    description: 'The id of the volunteer',
    isArray: true,
    type: VolunteerAssignmentRequestDto,
  })
  @IsArray()
  @Type(() => VolunteerAssignmentRequestDto)
  @ValidateNested({ each: true })
  volunteers: VolunteerAssignmentRequestDto[];

  @ApiProperty({
    required: true,
    description: 'The id of the timespan',
    type: Number,
  })
  @IsNumber()
  @IsPositive()
  timespanId: number;
}

export class UpdateAffectedTeamRequestDto {
  @ApiProperty({
    required: true,
    description: 'The team code volunteer will be assigned as',
    type: String,
  })
  @IsString()
  team: string;
}
