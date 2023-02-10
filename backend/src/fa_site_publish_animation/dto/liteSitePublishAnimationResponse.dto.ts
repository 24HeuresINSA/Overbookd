import { ApiProperty } from '@nestjs/swagger';
import { site_publish_animation_category_type } from '@prisma/client';
import { IsBoolean } from 'class-validator';
import {
  LiteSitePublishAnimation,
  SitePublishAnimationCategoryType,
} from '../interfaces';

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
    description: 'Is the activty a major activity',
  })
  @IsBoolean()
  isMajor: boolean;

  @ApiProperty({
    required: true,
    description: 'The description of the animation',
    type: String,
  })
  description: string;

  @ApiProperty({
    required: true,
    description: 'The categories of the animation',
    enum: SitePublishAnimationCategoryType,
    isArray: true,
  })
  categories: site_publish_animation_category_type[];
}
