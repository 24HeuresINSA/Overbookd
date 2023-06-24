import { SitePublishAnimationCategoryType } from '@prisma/client';
import { Period } from 'src/gear-requests/gearRequests.model';

export interface SitePublishAnimationFa {
  id: number;
  name: string;
  timeWindows: Period[];
}

export interface SitePublishAnimation
  extends Required<LiteSitePublishAnimation> {
  fa: SitePublishAnimationFa;
}

export interface LiteSitePublishAnimation {
  photoLink?: string;
  description?: string;
  isMajor?: boolean;
  categories?: SitePublishAnimationCategoryType[];
}
