import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

//Placeholder pour le moment, à définir mieux
export enum Type_Signa {
  BANNIERE = 'BANNIERE',
  PANNEAU = 'PANNEAU',
  PANCARTE = 'PANCARTE'
}


export class CreateFaSignaNeedDto {

  @ApiProperty({
    required: true,
    description: "Lieu de l'activité",
  })
  @IsString()
  @IsNotEmpty()


  @ApiProperty({
    required: true,
    description: 'Do we need signa ?',
  })
  @IsBoolean()
  IsNecessary: boolean;

  @ApiProperty({
    required: true,
    description: 'The type of signa',
    enum: Type_Signa,
  })
type : Type_Signa;

 @ApiProperty({
    required: true,
    description: 'Number of signa type required',
  })
  @IsNumber()
  @IsNotEmpty()


  @ApiProperty({
    required: true,
    description: 'The text to be written on the signa',
  })
  @IsString()
  text: string;

  @ApiProperty({
    required: false,
    description: 'Any comment about the signa needed ?',
  })
  @IsString()
  @IsOptional()
  comment: string;
}
