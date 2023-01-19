import { ApiProperty } from '@nestjs/swagger';
import { GearRepresentation } from 'src/common/dto/gearRepresentation.dto';
import { Gear } from '../../../catalog/interfaces';
import {
  GearRequest,
  ApprovedGearRequest,
  GearSeeker,
  GearSeekerType,
  Period,
  APPROVED,
} from '../gearRequests.service';

class GearSeekerRepresentation implements GearSeeker {
  type: GearSeekerType;
  id: number;
}

class PeriodRepresentation implements Period {
  id: number;
  start: Date;
  end: Date;
}

export class GearRequestResponseDto implements GearRequest {
  @ApiProperty({
    required: true,
    description: 'Gear seeker',
    type: GearSeekerRepresentation,
  })
  seeker: GearSeeker;

  @ApiProperty({
    required: true,
    description: 'Gear Request status',
    type: String,
  })
  status: string;

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

  @ApiProperty({
    required: false,
    description: 'Gear request drive location',
    type: String,
  })
  drive?: string;
}

export class ApprovedGearRequestResponseDto
  extends GearRequestResponseDto
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
