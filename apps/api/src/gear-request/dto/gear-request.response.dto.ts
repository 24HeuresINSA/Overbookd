import { ApiProperty } from '@nestjs/swagger';
import { GearRepresentation } from '../../common/dto/gear-representation.dto';
import { Gear } from '../../catalog/interfaces';
import {
  GearRequest,
  ApprovedGearRequest,
  GearSeeker,
  GearSeekerType,
  Period,
  APPROVED,
} from '../gear-request.model';

class GearSeekerRepresentation implements GearSeeker {
  type: GearSeekerType;
  id: number;
  name: string;
}

class PeriodRepresentation implements Period {
  id: number;
  start: Date;
  end: Date;
}

class BaseGearRequestResponseDto {
  @ApiProperty({
    required: true,
    description: 'Gear seeker',
    type: GearSeekerRepresentation,
  })
  seeker: GearSeeker;

  @ApiProperty({
    required: true,
    description: 'Gear Request quantity',
    type: Number,
  })
  quantity: number;

  @ApiProperty({
    required: true,
    description: 'Gear requested',
    type: GearRepresentation,
  })
  gear: Gear;

  @ApiProperty({
    required: true,
    description: 'Gear request rental period',
    type: PeriodRepresentation,
  })
  rentalPeriod: Period;
}

export class GearRequestResponseDto
  extends BaseGearRequestResponseDto
  implements GearRequest
{
  @ApiProperty({
    required: true,
    description: 'Gear Request status',
    type: String,
  })
  status: string;

  @ApiProperty({
    required: false,
    description: 'Gear request drive location',
    type: String,
  })
  drive?: string;
}

export class ApprovedGearRequestResponseDto
  extends BaseGearRequestResponseDto
  implements ApprovedGearRequest
{
  @ApiProperty({
    required: true,
    description: 'Gear Request status',
    type: String,
  })
  status: typeof APPROVED;

  @ApiProperty({
    required: true,
    description: 'Gear Request drive',
    type: String,
  })
  drive: string;
}
