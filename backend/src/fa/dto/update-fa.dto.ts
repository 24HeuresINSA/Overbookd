import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidationArguments,
} from 'class-validator';

export enum Status {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  VALIDATED = 'VALIDATED',
  REFUSED = 'REFUSED',
}

enum fa_type {
  Concert = 'Concert',
  Course = 'Course',
  Divertissement = 'Divertissement',
  Initiation = 'Initiation',
  Tournoi = 'Tournoi',
  Vente = 'Vente',
  Prevention = 'Prevention',
  Spectacle = 'Spectacle',
  Autre = 'Autre',
}

export class UpdateFaDto {
  @ApiProperty({
    required: true,
    description: 'The name of the fa',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    required: false,
    description: 'The creation date of the fa',
    default: new Date(),
  })
  @IsOptional()
  @IsDateString()
  created_at?: Date;

  @ApiProperty({
    required: false,
    description: 'The type of the fa',
  })
  @IsEnum(fa_type, {
    message: (va: ValidationArguments) =>
      `${va.property} must be one of ${Object.values(Status)}`,
  })
  @IsOptional()
  type?: fa_type;

  @ApiProperty({
    required: false,
    description: 'The id of the team whos responsible of the fa',
  })
  @IsNumber()
  @IsOptional()
  team_id?: number;

  @ApiProperty({
    required: false,
    description: 'The id of the user who is responsible of the fa',
  })
  @IsNumber()
  @IsOptional()
  in_charge?: number;

  @ApiProperty({
    required: false,
    description: 'The id of the location of the fa',
  })
  @IsNumber()
  @IsOptional()
  location_id?: number;

  @ApiProperty({
    required: false,
    description: 'The status of the fa',
    enum: Status,
  })
  @IsEnum(Status, {
    message: (va: ValidationArguments) =>
      `${va.property} must be one of ${Object.values(Status)}`,
  })
  status?: Status;

  @ApiProperty({
    required: false,
    description: 'The description of the fa',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    required: false,
    description: 'Is the activity publishable on the website',
  })
  @IsBoolean()
  @IsOptional()
  is_publishable?: boolean;

  @ApiProperty({
    required: false,
    description: 'Link of the photo',
  })
  @IsString()
  @IsOptional()
  photo_link?: string;

  @ApiProperty({
    required: false,
    description: 'Is the activty a major activity',
  })
  @IsBoolean()
  @IsOptional()
  is_major?: boolean;

  @ApiProperty({
    required: false,
    description: 'Is the activity for kids',
  })
  @IsBoolean()
  @IsOptional()
  is_kids?: boolean;

  @ApiProperty({
    required: false,
    description: 'The security needs',
  })
  @IsString()
  @IsOptional()
  security_needs?: string;

  @ApiProperty({
    required: false,
    description: 'Is security pass required',
  })
  @IsBoolean()
  @IsOptional()
  is_pass_required?: boolean;

  @ApiProperty({
    required: false,
    description: 'Number of security pass if required',
  })
  @IsNumber()
  @IsOptional()
  number_of_pass?: number;

  @ApiProperty({
    required: false,
    description: 'Text description about water',
  })
  @IsString()
  @IsOptional()
  water_needs?: string;

  @ApiProperty({
    required: false,
    description: 'The waterflow needed',
  })
  @IsNumber()
  @IsOptional()
  water_flow_required?: number;
}
