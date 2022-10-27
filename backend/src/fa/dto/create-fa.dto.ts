import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export enum Status {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  VALIDATED = 'VALIDATED',
  REFUSED = 'REFUSED',
}

export class CreateFaDto {
  @ApiProperty({
    required: true,
    description: 'The name of the fa',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    required: true,
    description: 'The creation date of the fa',
  })
  created_at: Date;

  @ApiProperty({
    required: true,
    description: 'The type of the fa',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    required: true,
    description: 'The id of the team whos responsible of the fa',
  })
  @IsNumber()
  team_id: number;

  @ApiProperty({
    required: true,
    description: 'The id of the user who is responsible of the fa',
  })
  @IsNumber()
  in_charge: number;

  @ApiProperty({
    required: true,
    description: 'The id of the location of the fa',
  })
  @IsNumber()
  location_id: number;

  @ApiProperty({
    required: true,
    description: 'The status of the fa',
    enum: [Status.DRAFT, Status.SUBMITTED, Status.VALIDATED, Status.REFUSED],
  })
  status: Status;

  @ApiProperty({
    required: true,
    description: 'The description of the fa',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    required: true,
    description: 'Is the activity publishable on the website',
  })
  @IsBoolean()
  is_publishable: boolean;

  @ApiProperty({
    required: true,
    description: 'Is the activty a major activity',
  })
  @IsBoolean()
  is_major: boolean;

  @ApiProperty({
    required: true,
    description: 'Is the activity for kids',
  })
  @IsBoolean()
  is_kids: boolean;

  @ApiProperty({
    required: false,
    description: 'The id of the users who validated the fa',
  })
  @IsArray()
  @IsOptional()
  validated_by: number[];

  @ApiProperty({
    required: false,
    description: 'The id of the users who refused the fa',
  })
  @IsArray()
  @IsOptional()
  refused_by: number[];

  @ApiProperty({
    required: false,
    description: 'The security needs',
  })
  @IsString()
  @IsOptional()
  security_needs: string;

  @ApiProperty({
    required: false,
    description: 'All of the collaborators ids',
  })
  @IsArray()
  @IsOptional()
  collaborator_id: number[];

  @ApiProperty({
    required: false,
    description: 'The waterflow needed',
  })
  @IsNumber()
  @IsOptional()
  waterflow_required: number;
}
