import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ApproveGearRequestForm } from '../gearRequests.model';

export class GearRequestsApproveFormRequestDto
  implements ApproveGearRequestForm
{
  @ApiProperty({
    required: true,
    description: 'Gear Request drive',
    type: String,
  })
  @IsString()
  drive: string;
}
