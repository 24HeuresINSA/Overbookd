import {
  collaborator,
  FA,
  FaSitePublishAnimation,
  fa_electricity_needs,
  fa_signa_needs,
  fa_type,
  GearRequest,
  time_windows,
  time_windows_type,
} from "../models/FA";

// General
export function hasName(value: string | undefined): string | boolean {
  return !!value || "L'animation doit avoir un nom.";
}
export function hasType(value: fa_type | undefined): string | boolean {
  return value !== null || "L'animation doit avoir un type.";
}
export function hasTeam(value: number | undefined): string | boolean {
  return value !== null || "L'animation doit avoir une team.";
}
export function hasInCharge(value: number | undefined): string | boolean {
  return value !== null || "L'animation doit avoir un responsable.";
}
export function hasGeneralErrors(fa: FA): string[] {
  return [
    hasName(fa.name),
    hasType(fa.type),
    hasTeam(fa.team_id),
    hasInCharge(fa.in_charge),
  ].filter((error): error is string => error !== true);
}

// Detail
export function hasDescriptionToPublish(fa: FA): string | boolean {
  if (!fa.faSitePublishAnimation?.faId) return true;
  return (
    (!!fa.description && fa.description !== "<p></p>") ||
    "L'animation n'a pas de description a publié sur le site."
  );
}
export function hasPhotoLinkToPublish(fa: FA): string | boolean {
  if (!fa.faSitePublishAnimation?.faId) return true;
  return (
    !!fa.faSitePublishAnimation.photoLink ||
    "L'animation n'a pas de photo a publié sur le site."
  );
}
export function isPublishable(
  value: FaSitePublishAnimation | undefined
): string | boolean {
  return value?.faId !== null || "L'animation ne sera pas publié sur le site.";
}
export function hasDetailErrors(fa: FA): string[] {
  return [hasDescriptionToPublish(fa), hasPhotoLinkToPublish(fa)].filter(
    (error): error is string => error !== true
  );
}
export function hasDetailsWarnings(fa: FA): string[] {
  return [isPublishable(fa.faSitePublishAnimation)].filter(
    (warning): warning is string => warning !== true
  );
}

// Signa
export function hasLocation(value: number | undefined): string | boolean {
  return Boolean(value) || "L'animation n'a pas de location.";
}
export function hasSignaNeeds(
  value: fa_signa_needs[] | undefined
): string | boolean {
  return (
    (value && value.length > 0) || "L'animation n'a pas besoin de signalétique."
  );
}
export function hasSignaNeedsWithQuantityHigherThanZero(
  signaNeeds: fa_signa_needs[] | undefined
): string | boolean {
  return (
    (signaNeeds && signaNeeds.some((signaNeed) => signaNeed.count > 0)) ||
    "Chaque demande de signa doit avoir une quantité."
  );
}
export function hasSignaErrors(fa: FA): string[] {
  return [
    hasLocation(fa.location_id),
    hasSignaNeedsWithQuantityHigherThanZero(fa.fa_signa_needs),
  ].filter((error): error is string => error !== true);
}
export function hasSignaWarnings(fa: FA): string[] {
  return [hasSignaNeeds(fa.fa_signa_needs)].filter(
    (warning): warning is string => warning !== true
  );
}

// Time Windows
export function hasAtLeastOneAnimationTimeWindow(
  timeWindows: time_windows[] | undefined
): string | boolean {
  return (
    (timeWindows &&
      timeWindows.filter(
        (timeWindow) => timeWindow.type === time_windows_type.ANIM
      ).length > 0) ||
    "L'animation doit avoir au moins une plage horaire."
  );
}
export function hasTimeWindowsErrors(fa: FA): string[] {
  return [hasAtLeastOneAnimationTimeWindow(fa.time_windows)].filter(
    (error): error is string => error !== true
  );
}

// Security
export function hasPassNumberHigherThanZero(fa: FA): string | boolean {
  return (
    !fa.is_pass_required ||
    (fa.number_of_pass && fa.number_of_pass > 0) ||
    "Le nombre de Pass Sécu nécessaire doit être supérieur à 0."
  );
}
export function hasSecurityNeeds(value: string): string | boolean {
  return (
    !!value ||
    "Cette activité n'a pas besoin de dispositif de sécurité particulier."
  );
}

// Collaborator
export function isCollaboratorNotEmpty(
  collaborator: collaborator
): string | boolean {
  const { id, ...rest } = collaborator;
  return (
    !Object.keys(rest).every((key) => !rest[key as keyof typeof rest]) ||
    "Cette animation n'a pas de prestataire."
  );
}
export function hasCollaboratorMandatoryFieldsFilled(
  collaborator: collaborator
): string | boolean {
  if (!collaborator || isCollaboratorNotEmpty(collaborator) !== true) {
    return true;
  }
  const { firstname, lastname, phone } = collaborator;
  const hasMandatoryFieldsFilled = Boolean(firstname && lastname && phone);
  return (
    hasMandatoryFieldsFilled ||
    "Les informations obligatoires du prestataire sont incomplètes."
  );
}
export function hasCollaboratorOptionalFieldsFilled(
  collaborator: collaborator
): string | boolean {
  if (
    !collaborator ||
    isCollaboratorNotEmpty(collaborator) !== true ||
    hasCollaboratorMandatoryFieldsFilled(collaborator) !== true
  ) {
    return true;
  }
  const { email, company, comment } = collaborator;
  const hasOptionalFieldsFilled = Boolean(email && company && comment);
  return (
    hasOptionalFieldsFilled ||
    "Les informations du prestataire sont incomplètes."
  );
}

// Gear Requests
export function hasAtLeastOneMatosGearRequest(
  gearRequests: GearRequest[]
): string | boolean {
  return gearRequests.length > 0 || "L'animation n'a pas besoin de Matos.";
}
export function hasAtLeastOneBarrieresGearRequest(
  gearRequests: GearRequest[]
): string | boolean {
  return gearRequests.length > 0 || "L'animation n'a pas besoin de Barrières.";
}
export function hasAtLeastOneElecGearRequest(
  gearRequests: GearRequest[]
): string | boolean {
  return (
    gearRequests.length > 0 ||
    "L'animation n'a pas besoin de Matos Elec et Eau."
  );
}
export function hasMatosGearRequestWithQuantityHigherThanZero(
  matosGearRequests: GearRequest[]
): string | boolean {
  return (
    matosGearRequests.length === 0 ||
    matosGearRequests.some((gearRequest) => gearRequest.quantity > 0) ||
    "Chaque matériel Matos doit avoir une quantité."
  );
}
export function hasBarrieresGearRequestWithQuantityHigherThanZero(
  barrieresGearRequests: GearRequest[]
): string | boolean {
  return (
    barrieresGearRequests.length === 0 ||
    barrieresGearRequests.some((gearRequest) => gearRequest.quantity > 0) ||
    "Chaque matériel Barrières doit avoir une quantité."
  );
}
export function hasElecGearRequestWithQuantityHigherThanZero(
  elecGearRequests: GearRequest[]
): string | boolean {
  return (
    elecGearRequests.length === 0 ||
    elecGearRequests.some((gearRequest) => gearRequest.quantity > 0) ||
    "Chaque matériel Elec doit avoir une quantité."
  );
}

// Elec
export function hasElecNeeds(
  elecNeeds: fa_electricity_needs[]
): string | boolean {
  return elecNeeds.length > 0 || "L'animation n'a pas besoin d'électricité.";
}

// Water
export function hasWaterNeeds(value: string): string | boolean {
  return !!value || "L'animation n'a pas besoin d'eau.";
}
