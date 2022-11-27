import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsNumber,
  ValidateNested,
} from 'class-validator';

class Collaborator {
  @ApiProperty({
    required: true,
    description: 'The firstname of the collaborator',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  firstname: string;

  @ApiProperty({
    required: true,
    description: 'The lastname of the collaborator',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  lastname: string;

  @ApiProperty({
    required: true,
    description: 'The phone number of the collaborator',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(10)
  phone: string;

  @ApiProperty({
    required: false,
    description: 'The email of the collaborator',
  })
  @IsString()
  @IsOptional()
  //regex for email for @Match
  @Matches(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/, {
    message: 'email is not valid',
  })
  email?: string;

  @ApiProperty({
    required: false,
    description: 'The company of the collaborator',
  })
  @IsString()
  @IsOptional()
  @MaxLength(30)
  company?: string;

  @ApiProperty({
    required: false,
    description: 'Any comments about the collaborator',
  })
  @IsString()
  @IsOptional()
  comment?: string;
}

export class CreateCollaboratorDto {
  @ApiProperty({
    required: true,
    description: 'The collaborator',
  })
  @IsNotEmpty()
  @Type(() => Collaborator)
  @ValidateNested()
  collaborator: Collaborator;
}
