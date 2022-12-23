import {
  collaborator,
  FA,
  FaSitePublishAnimation,
  fa_collaborators,
  fa_electricity_needs,
  fa_signa_needs,
  fa_type,
  GearRequest,
  time_windows,
  time_windows_type,
} from "../models/FA";

export function hasAtLeastOneError(store: any) {
  const errors = [
    ...hasGeneralErrors(store.mFA),
    ...hasDetailErrors(store.mFA),
    ...hasSignaErrors(store.mFA),
    ...hasTimeWindowsErrors(store.mFA),
    ...hasSecurityErrors(store.mFA),
    ...hasCollaboratorErrors(store.mFA),
    ...hasGearRequestErrors(store),
  ];
  return errors.length > 0;
}
export function hasAtLeastOneWarning(store: any) {
  const warnings = [
    ...hasDetailWarnings(store.mFA),
    ...hasSignaWarnings(store.mFA),
    ...hasSecurityWarnings(store.mFA),
    ...hasCollaboratorWarnings(store.mFA),
    ...hasGearRequestWarnings(store),
    ...hasElecWarnings(store.mFA),
    ...hasWaterWarnings(store.mFA),
  ];
  return warnings.length > 0;
}

// General
function hasName(value: string | undefined): string | boolean {
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
export function hasDescription(value: string | undefined): string | boolean {
  return (
    (!!value && value !== "<p></p>") || "L'animation n'a pas de description."
  );
}
export function hasDescriptionToPublish(fa: FA): string | boolean {
  if (!fa.faSitePublishAnimation) return true;
  return (
    !!fa.faSitePublishAnimation?.description ||
    "L'animation n'a pas de description a publié sur le site."
  );
}
export function hasPhotoLinkToPublish(fa: FA): string | boolean {
  if (!fa.faSitePublishAnimation) return true;
  return (
    !!fa.faSitePublishAnimation?.photoLink ||
    "L'animation n'a pas de photo a publié sur le site."
  );
}
export function hasCategoriesToPublish(fa: FA): string | boolean {
  if (!fa.faSitePublishAnimation) return true;
  return (
    (fa.faSitePublishAnimation?.categories &&
      fa.faSitePublishAnimation.categories.length > 0) ||
    "L'animation n'a pas de catégorie a publié sur le site."
  );
}
export function isPublishable(
  value: FaSitePublishAnimation | undefined
): string | boolean {
  return !!value || "L'animation ne sera pas publié sur le site.";
}
export function hasDetailErrors(fa: FA): string[] {
  return [
    hasDescriptionToPublish(fa),
    hasPhotoLinkToPublish(fa),
    hasCategoriesToPublish(fa),
  ].filter((error): error is string => error !== true);
}
export function hasDetailWarnings(fa: FA): string[] {
  return [
    hasDescription(fa.description),
    isPublishable(fa.faSitePublishAnimation),
  ].filter((warning): warning is string => warning !== true);
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
  if (!signaNeeds || signaNeeds.length === 0) return true;
  return (
    signaNeeds.some((signaNeed) => signaNeed.count > 0) ||
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
export function hasSecurityPassNeeds(
  value: boolean | undefined
): string | boolean {
  return value || "Cette activité n'a pas besoin de Pass Sécu.";
}
export function hasPassNumberHigherThanZero(fa: FA): string | boolean {
  return (
    !fa.is_pass_required ||
    (fa.number_of_pass && fa.number_of_pass > 0) ||
    "Le nombre de Pass Sécu nécessaire doit être supérieur à 0."
  );
}
export function hasSecurityNeeds(value: string | undefined): string | boolean {
  return (
    !!value ||
    "Cette activité n'a pas besoin de dispositif de sécurité particulier."
  );
}
export function hasSecurityErrors(fa: FA): string[] {
  return [hasPassNumberHigherThanZero(fa)].filter(
    (error): error is string => error !== true
  );
}
export function hasSecurityWarnings(fa: FA): string[] {
  return [
    hasSecurityPassNeeds(fa.is_pass_required),
    hasSecurityNeeds(fa.security_needs),
  ].filter((error): error is string => error !== true);
}

// Collaborator
export function isCollaboratorNotEmpty(
  collaborator: collaborator | undefined
): string | boolean {
  if (!collaborator) return "Cette animation n'a pas de prestataire.";
  const { id, ...rest } = collaborator;
  return (
    !Object.keys(rest).every((key) => !rest[key as keyof typeof rest]) ||
    "Cette animation n'a pas de prestataire."
  );
}
export function hasCollaboratorMandatoryFieldsFilled(
  collaborator: collaborator | undefined
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
  collaborator: collaborator | undefined
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
function getCollaborator(
  collaborators: fa_collaborators[] | undefined
): collaborator | undefined {
  if (!collaborators || collaborators.length === 0) return undefined;
  return collaborators[0]?.collaborator;
}
export function hasCollaboratorErrors(fa: FA): string[] {
  const collaborator = getCollaborator(fa.fa_collaborators);
  return [hasCollaboratorMandatoryFieldsFilled(collaborator)].filter(
    (error): error is string => error !== true
  );
}
export function hasCollaboratorWarnings(fa: FA): string[] {
  const collaborator = getCollaborator(fa.fa_collaborators);
  return [
    isCollaboratorNotEmpty(collaborator),
    hasCollaboratorOptionalFieldsFilled(collaborator),
  ].filter((warning): warning is string => warning !== true);
}

// Gear Requests
export function hasAtLeastOneMatosGearRequest(
  gearRequests: GearRequest[] | undefined
): string | boolean {
  return (
    (gearRequests && gearRequests.length > 0) ||
    "L'animation n'a pas besoin de Matos."
  );
}
export function hasAtLeastOneBarrieresGearRequest(
  gearRequests: GearRequest[] | undefined
): string | boolean {
  return (
    (gearRequests && gearRequests.length > 0) ||
    "L'animation n'a pas besoin de Barrières."
  );
}
export function hasAtLeastOneElecGearRequest(
  gearRequests: GearRequest[] | undefined
): string | boolean {
  return (
    (gearRequests && gearRequests.length > 0) ||
    "L'animation n'a pas besoin de Matos Elec et Eau."
  );
}
export function hasMatosGearRequestWithQuantityHigherThanZero(
  matosGearRequests: GearRequest[] | undefined
): string | boolean {
  return (
    matosGearRequests?.length === 0 ||
    matosGearRequests?.some((gearRequest) => gearRequest.quantity > 0) ||
    "Chaque matériel Matos doit avoir une quantité."
  );
}
export function hasBarrieresGearRequestWithQuantityHigherThanZero(
  barrieresGearRequests: GearRequest[]
): string | boolean {
  return (
    barrieresGearRequests?.length === 0 ||
    barrieresGearRequests?.some((gearRequest) => gearRequest.quantity > 0) ||
    "Chaque matériel Barrières doit avoir une quantité."
  );
}
export function hasElecGearRequestWithQuantityHigherThanZero(
  elecGearRequests: GearRequest[]
): string | boolean {
  return (
    elecGearRequests?.length === 0 ||
    elecGearRequests?.some((gearRequest) => gearRequest.quantity > 0) ||
    "Chaque matériel Elec doit avoir une quantité."
  );
}
export function hasGearRequestErrors(store: any): string[] {
  return [
    hasMatosGearRequestWithQuantityHigherThanZero(store.matosGearRequests),
    hasBarrieresGearRequestWithQuantityHigherThanZero(
      store.barrieresGearRequests
    ),
    hasElecGearRequestWithQuantityHigherThanZero(store.elecGearRequests),
  ].filter((error): error is string => error !== true);
}
export function hasGearRequestWarnings(store: any): string[] {
  return [
    hasAtLeastOneMatosGearRequest(store.matosGearRequests),
    hasAtLeastOneBarrieresGearRequest(store.barrieresGearRequests),
    hasAtLeastOneElecGearRequest(store.elecGearRequests),
  ].filter((warning): warning is string => warning !== true);
}

// Elec
export function hasElecNeeds(
  elecNeeds: fa_electricity_needs[] | undefined
): string | boolean {
  return (
    (elecNeeds && elecNeeds.length > 0) ||
    "L'animation n'a pas besoin d'électricité."
  );
}
export function hasElecWarnings(fa: FA): string[] {
  return [hasElecNeeds(fa.fa_electricity_needs)].filter(
    (warning): warning is string => warning !== true
  );
}

// Water
export function hasWaterNeeds(value: string | undefined): string | boolean {
  return !!value || "L'animation n'a pas besoin d'eau.";
}
export function hasWaterWarnings(fa: FA): string[] {
  return [hasWaterNeeds(fa.water_needs)].filter(
    (warning): warning is string => warning !== true
  );
}
