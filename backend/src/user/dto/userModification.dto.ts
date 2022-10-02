import { ApiProperty } from '@nestjs/swagger';

export class UserModificationDto {
  @ApiProperty({
    required: false,
    description: 'The firstname of the user',
  })
  firstname: string;

  @ApiProperty({
    required: false,
    description: 'The lastname of the user',
  })
  lastname: string;

  @ApiProperty({
    required: false,
    description: 'The nickname of the user',
  })
  nickname: string;

  @ApiProperty({
    required: false,
    description: 'The email of the user',
  })
  email: string;

  @ApiProperty({
    required: false,
    description: 'The birthdate of the user',
  })
  birthdate: Date;

  @ApiProperty({
    required: false,
    description: 'The phone number of the user',
  })
  phone: string;

  @ApiProperty({
    required: false,
    description: 'The departement of the user',
  })
  department: string;

  @ApiProperty({
    required: false,
    description: 'The study year of the user',
  })
  year: number;

  @ApiProperty({
    required: false,
    description: 'The profile picture link of the user',
  })
  pp: string;

  @ApiProperty({
    required: false,
    description: 'The charisma of the user',
  })
  charisma: number;

  @ApiProperty({
    required: false,
    description: 'The compte perso balance of the user',
  })
  balance: number;

  @ApiProperty({
    required: false,
    description: 'The password of the user',
  })
  password: string;

  @ApiProperty({
    required: false,
    description: 'The creation date of the user',
  })
  created_at: Date;

  @ApiProperty({
    required: false,
    description: 'The update date of the user',
  })
  updated_at: Date;

  @ApiProperty({
    required: false,
    description: 'If the user is deleted',
  })
  is_deleted: boolean;
}
