import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import {
  SitePublishAnimationCategoryType,
  sitePublishAnimationCategoryTypes,
} from '../faSitePublishAnimation.model';
import { LiteSitePublishAnimation } from '../faSitePublishAnimation.model';

export class LiteSitePublishAnimationResponseDto
  implements LiteSitePublishAnimation
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
    enum: sitePublishAnimationCategoryTypes,
    isArray: true,
  })
  categories: SitePublishAnimationCategoryType[];
}
