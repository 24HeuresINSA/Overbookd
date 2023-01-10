import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFtDto {
  @ApiProperty({
    required: true,
    description: 'The name of the ft',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
