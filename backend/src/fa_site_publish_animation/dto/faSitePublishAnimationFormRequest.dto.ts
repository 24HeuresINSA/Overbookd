import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber, IsOptional, IsString } from 'class-validator';
import {
  FaSitePublishAnimation,
  SitePublishAnimationCategoryType,
} from '../interfaces';

export class FaSitePublishAnimationFormRequestDto
  implements FaSitePublishAnimation
{
  @ApiProperty({
    required: true,
    description: 'The id of the linked fa',
  })
  @IsDefined()
  @IsNumber()
  faId: number;

  @ApiProperty({
    required: true,
    description: 'The link to the photo',
  })
  @IsOptional()
  @IsString()
  photoLink?: string;

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
