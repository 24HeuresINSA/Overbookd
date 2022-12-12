import { ApiProperty } from '@nestjs/swagger';
import { ApproveGearRequestForm } from '../gearRequests.service';

export class GearRequestsApproveFormRequestDto
  implements ApproveGearRequestForm
{
  @ApiProperty({
    required: true,
    description: 'Gear Request drive',
    type: String,
  })
  drive: string;
}
