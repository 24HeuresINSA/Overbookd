import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { LiteSitePublishAnimation } from '../interfaces';
import { FaSitePublishAnimationFormRequestDto } from './faSitePublishAnimationFormRequest.dto';

type LiteSitePublishAnimationWithFaId = LiteSitePublishAnimation & {
  faId: number;
};

export class FaSitePublishAnimationCreationFormRequestDto
  extends FaSitePublishAnimationFormRequestDto
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
