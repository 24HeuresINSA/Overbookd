import { ApiProperty } from '@nestjs/swagger';
import { Period } from 'src/gear-requests/gearRequests.service';
import { SitePublishAnimation, SitePublishAnimationFa } from '../interfaces';
import { LiteSitePublishAnimationResponseDto } from './liteSitePublishAnimationResponse.dto';

class SitePublishAnimationFaRepresentation implements SitePublishAnimationFa {
  id: number;
  name: string;
  timeWindows: Omit<Period, 'id'>[];
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
