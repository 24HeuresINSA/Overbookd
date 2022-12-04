import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
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
  @IsDefined()
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
    enum: fa_type
  })
  @IsOptional()
  @IsEnum(fa_type, {
    message: (va: ValidationArguments) =>
      `${va.property} must be one of ${Object.values(Status)}`,
  })
  type?: fa_type;

  @ApiProperty({
    required: false,
    description: 'The id of the team whos responsible of the fa',
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  team_id?: number;

  @ApiProperty({
    required: false,
    description: 'The id of the user who is responsible of the fa',
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  in_charge?: number;

  @ApiProperty({
    required: false,
    description: 'The id of the location of the fa',
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  location_id?: number;

  @ApiProperty({
    required: false,
    description: 'The status of the fa',
    enum: Status,
  })
  @IsOptional()
  @IsEnum(Status, {
    message: (va: ValidationArguments) =>
      `${va.property} must be one of ${Object.values(Status)}`,
  })
  status?: Status;

  @ApiProperty({
    required: false,
    description: 'The description of the fa',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    required: false,
    description: 'Is the activity publishable on the website',
  })
  @IsOptional()
  @IsBoolean()
  is_publishable?: boolean;

  @ApiProperty({
    required: false,
    description: 'Link of the photo',
  })
  @IsOptional()
  @IsString()
  photo_link?: string;

  @ApiProperty({
    required: false,
    description: 'Is the activty a major activity',
  })
  @IsOptional()
  @IsBoolean()
  is_major?: boolean;

  @ApiProperty({
    required: false,
    description: 'Is the activity for kids',
  })
  @IsOptional()
  @IsBoolean()
  is_kids?: boolean;

  @ApiProperty({
    required: false,
    description: 'The security needs',
  })
  @IsOptional()
  @IsString()
  security_needs?: string;

  @ApiProperty({
    required: false,
    description: 'Is security pass required',
  })
  @IsOptional()
  @IsBoolean()
  is_pass_required?: boolean;

  @ApiProperty({
    required: false,
    description: 'Number of security pass if required',
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  number_of_pass?: number;

  @ApiProperty({
    required: false,
    description: 'Text description about water',
  })
  @IsOptional()
  @IsString()
  water_needs?: string;

  @ApiProperty({
    required: false,
    description: 'The waterflow needed',
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  water_flow_required?: number;
}
