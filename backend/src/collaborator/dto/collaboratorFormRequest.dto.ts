import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  MaxLength,
  IsPhoneNumber,
  IsEmail,
} from 'class-validator';

export class CollaboratorFormRequestDto {
  @ApiProperty({
    required: true,
    description: 'The firstname of the collaborator',
  })
  @IsString()
  @IsOptional()
  @MaxLength(30)
  firstname?: string;

  @ApiProperty({
    required: true,
    description: 'The lastname of the collaborator',
  })
  @IsString()
  @IsOptional()
  @MaxLength(30)
  lastname?: string;

  @ApiProperty({
    required: true,
    description: 'The phone number of the collaborator',
  })
  @IsOptional()
  @IsPhoneNumber('FR')
  phone?: string;

  @ApiProperty({
    required: false,
    description: 'The email of the collaborator',
  })
  @IsEmail()
  @IsOptional()
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
