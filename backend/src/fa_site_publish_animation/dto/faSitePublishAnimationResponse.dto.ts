import { ApiProperty } from '@nestjs/swagger';
import { site_publish_animation_category_type } from '@prisma/client';
import {
  FaSitePublishAnimation,
  SitePublishAnimationCategoryType,
} from '../interfaces';

export class FaSitePublishAnimationResponseDto
  implements FaSitePublishAnimation
{
  @ApiProperty({
    required: true,
    description: 'Related FA id of the publish animation',
    type: Number,
  })
  faId: number;

  @ApiProperty({
    required: true,
    description: 'The link to the photo',
    type: String,
  })
  photoLink: string;

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
