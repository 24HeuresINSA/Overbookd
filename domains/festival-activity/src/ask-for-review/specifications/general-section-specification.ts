import { Draft } from "../../festival-activity";

const REQUIRED_DESCRIPTION = "Une description est nécessaire";
const REQUIRED_PHOTO_ON_PUBLIC_ACTIVITY =
  "Une photo est nécessaire pour les animations publiées";
const REQUIRED_CATEGORIES_ON_PUBLIC_ACTIVITY =
  "Au moins une catégorie est nécessaire pour les animations publiées";
const REQUIRED_TIMEWINDOWS_ON_PUBLIC_ACTIVITY =
  "Au moins un créneau horaire est nécessaire pour les animations publiées";

type PublicDraftGeneral = Draft["general"] & {
  toPublish: true;
};

export class ActivityGeneralSpecification {
  static errors(section: Draft["general"]): string[] {
    return this.hasDescriptionSet(section) ? [] : [REQUIRED_DESCRIPTION];
  }

  private static hasDescriptionSet(section: Draft["general"]) {
    return section.description !== null;
  }
}

export class PublicActivityGeneralSpecification {
  static errors(section: PublicDraftGeneral): string[] {
    return [
      ...ActivityGeneralSpecification.errors(section),
      ...this.photoLinkError(section),
      ...this.categoriesError(section),
      ...this.timeWindowsError(section),
    ];
  }

  private static timeWindowsError(section: PublicDraftGeneral): string[] {
    if (this.hasAtLeastOneTimeWindow(section)) return [];

    return [REQUIRED_TIMEWINDOWS_ON_PUBLIC_ACTIVITY];
  }

  private static categoriesError(section: PublicDraftGeneral): string[] {
    if (this.hasAtLeastOneCategory(section)) return [];

    return [REQUIRED_CATEGORIES_ON_PUBLIC_ACTIVITY];
  }

  private static photoLinkError(section: PublicDraftGeneral): string[] {
    if (this.hasPhotoLinkSet(section)) return [];

    return [REQUIRED_PHOTO_ON_PUBLIC_ACTIVITY];
  }

  private static hasAtLeastOneTimeWindow(section: PublicDraftGeneral) {
    return section.timeWindows.length > 0;
  }

  private static hasAtLeastOneCategory(section: PublicDraftGeneral) {
    return section.categories.length > 0;
  }

  private static hasPhotoLinkSet(section: PublicDraftGeneral) {
    return section.photoLink !== null;
  }
}

export function isPublicActivity(
  general: Draft["general"],
): general is PublicDraftGeneral {
  return general.toPublish;
}
