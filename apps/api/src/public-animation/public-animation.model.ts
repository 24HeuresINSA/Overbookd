import { Period } from "../gear-request/gear-request.model";

const DIVERTISSEMENT = "Divertissement";
const CULTURE = "Culture";
const SPORT = "Sport";
const ENFANT = "Enfant";
const AUTRE = "Autre";

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

export interface PublicAnimationFa {
  id: number;
  name: string;
  timeWindows: Period[];
}

export interface PublicAnimationWithFa extends Required<PublicAnimation> {
  fa: PublicAnimationFa;
}

export interface PublicAnimation {
  photoLink?: string;
  description?: string;
  isFlagship?: boolean;
  categories?: AnimationCategory[];
}
