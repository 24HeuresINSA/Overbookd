import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import {
  AnimationCategory,
  LiteSitePublishAnimation as LiteFaSitePublishAnimation,
  animationCategories,
} from '../fa-site-publish-animation.model';

export class LiteFaSitePublishAnimationResponseDto
  implements LiteFaSitePublishAnimation
{
  @ApiProperty({
    required: true,
    description: 'The link to the photo',
    type: String,
  })
  photoLink: string;

  @ApiProperty({
    required: false,
    description: 'Is the activty a flagship one',
  })
  @IsBoolean()
  isFlagship: boolean;

  @ApiProperty({
    required: true,
    description: 'The description of the animation',
    type: String,
  })
  description: string;

  @ApiProperty({
    required: true,
    description: 'The categories of the animation',
    enum: animationCategories,
    isArray: true,
  })
  categories: AnimationCategory[];
}
