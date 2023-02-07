import { site_publish_animation_category_type } from '@prisma/client';
import { Period } from 'src/gear-requests/gearRequests.service';

export interface SitePublishAnimationFa {
  id: number;
  name: string;
  timeWindows: Omit<Period, 'id'>[];
}

export interface SitePublishAnimation
  extends Required<LiteSitePublishAnimation> {
  fa: SitePublishAnimationFa;
}

export interface LiteSitePublishAnimation {
  photoLink?: string;
  description?: string;
  isMajor: boolean;
  categories?: site_publish_animation_category_type[];
}

export enum SitePublishAnimationCategoryType {
  Divertissement = 'Divertissement',
  Culture = 'Culture',
  Sport = 'Sport',
  Enfant = 'Enfant',
  Autre = 'Autre',
}
