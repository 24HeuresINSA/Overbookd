import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import {
  AnimationCategory,
  PublicAnimation,
  animationCategories,
} from '../public-animation.model';

export class UpdatePublicAnimationRequestDto
  implements PublicAnimation
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
    description: 'Is the activty a flagship one',
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
    enum: animationCategories,
    isArray: true,
  })
  @IsOptional()
  categories?: AnimationCategory[];
}
