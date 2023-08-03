import { ApiProperty } from '@nestjs/swagger';
import { Period } from '../../gear-request/gear-request.model';
import {
  SitePublishAnimation,
  SitePublishAnimationFa,
} from '../fa-site-publish-animation.model';
import { LiteFaSitePublishAnimationResponseDto } from './lite-fa-site-publish-animation.response.dto';

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

export class FaSitePublishAnimationResponseDto
  extends LiteFaSitePublishAnimationResponseDto
  implements SitePublishAnimation
{
  @ApiProperty({
    required: true,
    description: 'The fa linked',
    type: SitePublishAnimationFaRepresentation,
  })
  fa: SitePublishAnimationFa;
}
