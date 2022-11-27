import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  ValidationArguments,
} from 'class-validator';
import { CreateCollaboratorDto } from '../../collaborator/dto/create-collaborator.dto';
import { CreateFaSignaNeedDto } from '../../fa_signa_needs/dto/create-fa_signa_need.dto';
import { CreateFaCommentDto } from '../../fa_comment/dto/create-fa_comment.dto';
import { CreateTimeWindowDto } from '../../time_windows/dto/create-time_window.dto';
import { CreateFaElectricityNeedDto } from '../../fa_electricity_needs/dto/create-fa_electricity_need.dto';
import { Type } from 'class-transformer';

export enum Status {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  VALIDATED = 'VALIDATED',
  REFUSED = 'REFUSED',
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
  created_at?: Date;

  @ApiProperty({
    required: false,
    description: 'The type of the fa',
  })
  @IsString()
  @IsOptional()
  type?: string;

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
  @ApiProperty({
    required: false,
    description: 'The collaborators',
    default: [],
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateCollaboratorDto)
  fa_collaborator?: CreateCollaboratorDto[];

  @ApiProperty({
    required: false,
    description: 'The signalisation needs',
    default: [],
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateFaSignaNeedDto)
  fa_signa_needs?: CreateFaSignaNeedDto[];

  @ApiProperty({
    required: false,
    description: 'The comments',
    default: [],
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateFaCommentDto)
  fa_comment?: CreateFaCommentDto[];

  @ApiProperty({
    required: false,
    description: 'The time windows',
    default: [],
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateTimeWindowDto)
  time_window?: CreateTimeWindowDto[];

  @ApiProperty({
    required: false,
    description: 'The electricity needs',
    default: [],
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateFaElectricityNeedDto)
  fa_electricity_needs?: CreateFaElectricityNeedDto[];
}
