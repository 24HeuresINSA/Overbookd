import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsNumber,
  ValidateNested,
  IsDefined,
  IsPhoneNumber,
  IsEmail,
} from 'class-validator';

class Collaborator {
  @ApiProperty({
    required: false,
    description: 'The id of the collaborator',
  })
  @IsNumber()
  @IsOptional()
  id?: number;

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
  @IsDefined()
  @IsNotEmpty()
  @IsPhoneNumber('FR')
  phone: string;

  @ApiProperty({
    required: false,
    description: 'The email of the collaborator',
  })
  @IsDefined()
  @IsEmail()
  @IsNotEmpty()
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
  @Type(() => Collaborator)
  @ValidateNested()
  collaborator: Collaborator;
}
