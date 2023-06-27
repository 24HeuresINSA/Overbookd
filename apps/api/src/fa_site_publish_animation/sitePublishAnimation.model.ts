const Divertissement = 'Divertissement';
const Culture = 'Culture';
const Sport = 'Sport';
const Enfant = 'Enfant';
const Autre = 'Autre';

export const sitePublishAnimationCategoryType: Record<
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
