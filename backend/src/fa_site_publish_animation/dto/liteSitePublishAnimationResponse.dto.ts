import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { LiteSitePublishAnimation } from '../interfaces';
import {
  SitePublishAnimationCategoryType,
  sitePublishAnimationCategoryType,
} from '../sitePublishAnimation.model';

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
    description: 'Is the activty a flagship show',
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
    enum: sitePublishAnimationCategoryType,
    isArray: true,
  })
  categories: SitePublishAnimationCategoryType[];
}
