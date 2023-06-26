import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { LiteSitePublishAnimation } from '../interfaces';

enum SitePublishAnimationCategoryType {
  Divertissement = 'Divertissement',
  Culture = 'Culture',
  Sport = 'Sport',
  Enfant = 'Enfant',
  Autre = 'Autre',
}

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
  categories: SitePublishAnimationCategoryType[];
}
