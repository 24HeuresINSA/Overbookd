import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  MaxLength,
  IsPhoneNumber,
  IsEmail,
  IsDefined,
  IsNumber,
} from 'class-validator';
import { CollaboratorWithIdRepresentation } from '../collaborator.model';

export class CollaboratorResponseDto
  implements CollaboratorWithIdRepresentation
{
  @ApiProperty({
    required: true,
    description: 'The id of the collaborator',
  })
  @IsNumber()
  @IsDefined()
  id: number;

  @ApiProperty({
    required: true,
    description: 'The firstname of the collaborator',
  })
  @IsString()
  @IsDefined()
  @MaxLength(30)
  firstname: string;

  @ApiProperty({
    required: true,
    description: 'The lastname of the collaborator',
  })
  @IsString()
  @IsDefined()
  @MaxLength(30)
  lastname: string;

  @ApiProperty({
    required: true,
    description: 'The phone number of the collaborator',
    example: '0601020304',
  })
  @IsDefined()
  @IsPhoneNumber('FR')
  phone: string;

  @ApiProperty({
    required: false,
    description: 'The email of the collaborator',
    example: 'john@doe.com',
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
