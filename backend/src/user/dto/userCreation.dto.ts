import { ApiProperty } from '@nestjs/swagger';

export class UserCreationDto {
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
    enum: [
      'TC',
      'IF',
      'GE',
      'GM',
      'GI',
      'GCU',
      'GEN',
      'SGM',
      'BS',
      'FIMI',
      'AUTRE',
    ],
  })
  department: string;

  @ApiProperty({
    required: false,
    description: 'The study year of the user',
    enum: ['A1', 'A2', 'A3', 'A4', 'A5', 'VIEUX', 'AUTRE'],
  })
  year: string;

  @ApiProperty({
    required: false,
    description: 'The password of the user',
  })
  password: string;
}
