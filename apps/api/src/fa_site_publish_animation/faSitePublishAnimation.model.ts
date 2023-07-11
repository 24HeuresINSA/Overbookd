import { Period } from '../../src/gear-requests/gearRequests.model';

const DIVERTISSEMENT = 'Divertissement';
const CULTURE = 'Culture';
const SPORT = 'Sport';
const ENFANT = 'Enfant';
const AUTRE = 'Autre';

export const animationCategories: Record<AnimationCategory, AnimationCategory> =
  {
    Divertissement: DIVERTISSEMENT,
    Culture: CULTURE,
    Sport: SPORT,
    Enfant: ENFANT,
    Autre: AUTRE,
  };

export type AnimationCategory =
  | typeof DIVERTISSEMENT
  | typeof CULTURE
  | typeof SPORT
  | typeof ENFANT
  | typeof AUTRE;

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
  categories?: AnimationCategory[];
}
