import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import {
  LiteSitePublishAnimation,
  SitePublishAnimationCategoryType,
} from '../interfaces';

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
    description: 'Is the activty a major activity',
  })
  @IsOptional()
  @IsBoolean()
  isMajor?: boolean;

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
    enum: SitePublishAnimationCategoryType,
    isArray: true,
  })
  @IsOptional()
  categories?: SitePublishAnimationCategoryType[];
}
