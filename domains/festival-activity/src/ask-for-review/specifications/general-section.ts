import { GeneralSection } from "../../creation/draft-festival-activity.model";

const REQUIRED_DESCRIPTION = "Une description est nécessaire";
const REQUIRED_PHOTO_ON_PUBLIC_ACTIVITY = "Une photo est nécessaire pour les animations publiées";
const REQUIRED_CATEGORIES_ON_PUBLIC_ACTIVITY = "Au moins une catégorie est nécessaire pour les animations publiées";
type PublicDraftGeneral = GeneralSection & {
  toPublish: true;
};
export class ActivityGeneralSpecification {
  static errors(section: GeneralSection): string[] {
    return section.description !== null ? [] : [REQUIRED_DESCRIPTION];
  }
}
const REQUIRED_TIMEWINDOWS_ON_PUBLIC_ACTIVITY = "Au moins un créneau horaire est nécessaire pour les animations publiées";
export class PublicActivityGeneralSpecification {
  static errors(section: PublicDraftGeneral): string[] {
    const photoLinkError = section.photoLink !== null ? [] : [REQUIRED_PHOTO_ON_PUBLIC_ACTIVITY];
    const categoriesError = section.categories.length > 0
      ? []
      : [REQUIRED_CATEGORIES_ON_PUBLIC_ACTIVITY];
    const timeWindowsError = section.timeWindows.length > 0
      ? []
      : [REQUIRED_TIMEWINDOWS_ON_PUBLIC_ACTIVITY];

    return [
      ...ActivityGeneralSpecification.errors(section),
      ...photoLinkError,
      ...categoriesError,
      ...timeWindowsError,
    ];
  }
}
export function isPublicActivity(
  general: GeneralSection
): general is PublicDraftGeneral {
  return general.toPublish;
}
