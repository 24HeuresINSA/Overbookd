import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateSignaLocationDto {
  @ApiProperty({
    description: 'The id of the location',
    required: true,
  })
  @IsNumber()
  id: number;
  @ApiProperty({
    description: 'The name of the location',
    example: 'Devant les humas',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
