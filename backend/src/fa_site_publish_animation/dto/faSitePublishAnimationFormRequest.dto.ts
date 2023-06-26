import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { LiteSitePublishAnimation } from '../interfaces';
import {
  SitePublishAnimationCategoryType,
  sitePublishAnimationCategoryType,
} from '../sitePublishAnimation.model';

export class FaSitePublishAnimationFormRequestDto
  implements LiteSitePublishAnimation
{
  @ApiProperty({
    required: true,
    description: 'The link to the photo',
  })
  @IsOptional()
  @IsString()
  photoLink?: string;

  @ApiProperty({
    required: false,
    description: 'Is the activty a flagship show',
  })
  @IsOptional()
  @IsBoolean()
  isFlagship?: boolean;

  @ApiProperty({
    required: false,
    description: 'The description of the animation',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    required: true,
    description: 'The categories of the animation',
    enum: sitePublishAnimationCategoryType,
    isArray: true,
  })
  @IsOptional()
  categories?: SitePublishAnimationCategoryType[];
}
