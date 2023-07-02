import { Period } from 'src/gear-requests/gearRequests.model';

const Divertissement = 'Divertissement';
const Culture = 'Culture';
const Sport = 'Sport';
const Enfant = 'Enfant';
const Autre = 'Autre';

export const sitePublishAnimationCategoryTypes: Record<
  SitePublishAnimationCategoryType,
  SitePublishAnimationCategoryType
> = {
  Divertissement,
  Culture,
  Sport,
  Enfant,
  Autre,
};

export type SitePublishAnimationCategoryType =
  | typeof Divertissement
  | typeof Culture
  | typeof Sport
  | typeof Enfant
  | typeof Autre;

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
  isFlagship?: boolean;
  categories?: SitePublishAnimationCategoryType[];
}
