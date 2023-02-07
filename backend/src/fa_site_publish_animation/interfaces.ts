import { site_publish_animation_category_type } from '@prisma/client';

export interface FaSitePublishAnimation {
  faId: number;
  photoLink?: string;
  desctiption?: string;
  isMajor?: boolean;
  categories?: site_publish_animation_category_type[];
}

export enum SitePublishAnimationCategoryType {
  Divertissement = 'Divertissement',
  Culture = 'Culture',
  Sport = 'Sport',
  Enfant = 'Enfant',
  Autre = 'Autre',
}
