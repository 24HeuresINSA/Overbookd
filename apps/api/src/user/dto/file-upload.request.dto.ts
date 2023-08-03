import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FileUploadRequestDto {
  @ApiProperty({
    description: 'File to upload',
    type: 'string',
    format: 'binary',
  })
  @IsNotEmpty()
  @IsString()
  file: string;
}
