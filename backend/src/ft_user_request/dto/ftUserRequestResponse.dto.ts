import { ApiProperty } from '@nestjs/swagger';

export class FtUserRequestResponseDto {
  @ApiProperty({
    description: 'The id of the user requested on the time window',
    example: 1,
    required: true,
  })
  id: number;

  @ApiProperty({
    description: 'The firstname of the user requested on the time window',
    example: 'Jhon',
    required: true,
  })
  firstname: string;

  @ApiProperty({
    description: 'The lastname of the user requested on the time window',
    example: 'Doe',
    required: true,
  })
  lastname: string;
}
