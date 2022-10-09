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
  })
  department: string;

  @ApiProperty({
    required: false,
    description: 'The study year of the user',
  })
  year: number;

  @ApiProperty({
    required: false,
    description: 'The password of the user',
  })
  password: string;
}
