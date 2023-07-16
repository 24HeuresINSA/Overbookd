import { ApiProperty } from '@nestjs/swagger';
import { Period } from '../../gear-requests/gearRequests.model';
import {
  SitePublishAnimation,
  SitePublishAnimationFa,
} from '../faSitePublishAnimation.model';
import { LiteSitePublishAnimationResponseDto } from './liteSitePublishAnimationResponse.dto';

class PeriodRepresentation implements Period {
  @ApiProperty({})
  id: number;
  @ApiProperty({})
  start: Date;
  @ApiProperty({})
  end: Date;
}

class SitePublishAnimationFaRepresentation implements SitePublishAnimationFa {
  @ApiProperty({})
  id: number;
  @ApiProperty({})
  name: string;
  @ApiProperty({ isArray: true, type: PeriodRepresentation })
  timeWindows: Period[];
}

export class SitePublishAnimationResponseDto
  extends LiteSitePublishAnimationResponseDto
  implements SitePublishAnimation
{
  @ApiProperty({
    required: true,
    description: 'The fa linked',
    type: SitePublishAnimationFaRepresentation,
  })
  fa: SitePublishAnimationFa;
}
