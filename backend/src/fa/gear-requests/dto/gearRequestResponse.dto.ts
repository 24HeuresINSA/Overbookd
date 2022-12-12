import { ApiProperty } from '@nestjs/swagger';
import { SimplifiedCategoryRepresentation } from '../../../catalog/dto/gearResponse.dto';
import { Gear, Team } from '../../../catalog/interfaces';
import {
  GearRequest,
  GearSeeker,
  GearSeekerType,
  Period,
} from '../gearRequests.service';

class TeamRepresentation implements Team {
  name: string;
  code: string;
}

class GearRepresentation implements Gear {
  id: number;
  name: string;
  slug: string;
  category?: SimplifiedCategoryRepresentation;
  owner?: TeamRepresentation;
}

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
}
