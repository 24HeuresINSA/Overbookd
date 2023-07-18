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
import { CollaboratorWithOptionalIdRepresentation } from '../collaborator.model';

export class CollaboratorFormRequestDto
  implements CollaboratorWithOptionalIdRepresentation
{
  @ApiProperty({
    required: true,
    description: 'The collaborator id',
  })
  @IsNumber()
  @IsOptional()
  id?: number;

  @ApiProperty({
    required: true,
    description: 'The collaborator firstname',
  })
  @IsString()
  @IsDefined()
  @MaxLength(30)
  firstname: string;

  @ApiProperty({
    required: true,
    description: 'The collaborator lastname',
  })
  @IsString()
  @IsDefined()
  @MaxLength(30)
  lastname: string;

  @ApiProperty({
    required: true,
    description: 'The collaborator phone number',
    example: '0601020304',
  })
  @IsDefined()
  @IsPhoneNumber('FR')
  phone: string;

  @ApiProperty({
    required: false,
    description: 'The collaborator email',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    required: false,
    description: 'The collaborator company',
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
