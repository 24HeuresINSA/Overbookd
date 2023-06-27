import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFtDto {
  @ApiProperty({
    required: true,
    description: 'The name of the ft',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    required: false,
    description: 'The parent fa id of the ft',
  })
  @IsOptional()
  @IsNumber()
  parentFaId?: number;
}
