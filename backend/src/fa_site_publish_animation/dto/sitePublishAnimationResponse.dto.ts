import { ApiProperty } from '@nestjs/swagger';
import { Period } from 'src/gear-requests/gearRequests.model';
import {
  SitePublishAnimation,
  SitePublishAnimationFa,
} from '../faSitePublishAnimation.model';
import { LiteSitePublishAnimationResponseDto } from './liteSitePublishAnimationResponse.dto';

class SitePublishAnimationFaRepresentation implements SitePublishAnimationFa {
  id: number;
  name: string;
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
