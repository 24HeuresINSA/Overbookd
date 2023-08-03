import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ApproveGearRequestForm as ApproveGearRequest } from '../gear-request.model';

export class ApproveGearRequestRequestDto
  implements ApproveGearRequest
{
  @ApiProperty({
    required: true,
    description: 'Gear Request drive',
    type: String,
  })
  @IsString()
  drive: string;
}
