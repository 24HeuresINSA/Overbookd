import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { LiteSitePublishAnimation } from '../fa-site-publish-animation.model';
import { UpdateFaSitePublishAnimationRequestDto } from './update-fa-site-publish-animation.request.dto';

type LiteSitePublishAnimationWithFaId = LiteSitePublishAnimation & {
  faId: number;
};

export class CreateFaSitePublishAnimationRequestDto
  extends UpdateFaSitePublishAnimationRequestDto
  implements LiteSitePublishAnimationWithFaId
{
  @ApiProperty({
    required: true,
    description: 'Related FA id of the publish animation',
    type: Number,
  })
  @IsNumber()
  faId: number;
}
