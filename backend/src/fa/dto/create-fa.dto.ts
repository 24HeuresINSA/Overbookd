import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateSecurityPassDto } from '../../security_pass/dto/create-security_pass.dto';
import { CreateCollaboratorDto } from '../../collaborator/dto/create-collaborator.dto';

export enum Status {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  VALIDATED = 'VALIDATED',
  REFUSED = 'REFUSED',
}

class FA {
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
  @IsString()
  team_id: string;

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
    description: 'The security needs',
  })
  @IsString()
  @IsOptional()
  security_needs: string;

  @ApiProperty({
    required: false,
    description: 'The waterflow needed',
  })
  @IsNumber()
  @IsOptional()
  water_flow_required: number;
}

export class CreateFaDto {
  @ApiProperty({
    required: true,
    description: 'The fa',
  })
  @ValidateNested()
  FA: FA;

  @ApiProperty({
    required: false,
    description: 'The any collaborator',
  })
  @IsOptional()
  @ValidateNested()
  FA_Collaborators: CreateCollaboratorDto[];

  @ApiProperty({
    required: false,
    description: 'all security pass needed',
  })
  @IsOptional()
  @ValidateNested()
  Security_pass: CreateSecurityPassDto[];
}
