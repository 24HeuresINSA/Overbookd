import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber, IsOptional, IsString } from 'class-validator';

enum site_publish_animation_category_type {
  Divertissement = 'Divertissement',
  Culture = 'Culture',
  Sport = 'Sport',
  Enfant = 'Enfant',
}

export class CreateFaSitePublishAnimationServiceDto {
  @ApiProperty({
    required: false,
    description: 'The id of the published animation',
  })
  @IsOptional()
  @IsNumber()
  id?: number;

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
    enum: site_publish_animation_category_type,
    isArray: true,
  })
  @IsOptional()
  categories?: site_publish_animation_category_type[];
}
