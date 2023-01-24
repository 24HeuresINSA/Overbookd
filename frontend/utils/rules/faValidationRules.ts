import {
  collaborator,
  FA,
  FaSitePublishAnimation,
  fa_collaborators,
  fa_electricity_needs,
  fa_signa_needs,
  fa_type,
  SortedStoredGearRequests,
  time_windows,
  time_windows_type,
} from "../models/FA";
import { GearRequest } from "../models/gearRequests";

export function hasAtLeastOneError(
  mFA: FA,
  gearRequests: SortedStoredGearRequests
): boolean {
  const errors = [
    ...generalErrors(mFA),
    ...detailErrors(mFA),
    ...signaErrors(mFA),
    ...timeWindowsErrors(mFA),
    ...securityErrors(mFA),
    ...collaboratorErrors(mFA),
    ...gearRequestErrors(gearRequests),
  ];
  return errors.length > 0;
}
export function hasAtLeastOneWarning(
  mFA: FA,
  gearRequests: SortedStoredGearRequests
): boolean {
  const warnings = [
    ...detailWarnings(mFA),
    ...signaWarnings(mFA),
    ...securityWarnings(mFA),
    ...collaboratorWarnings(mFA),
    ...gearRequestWarnings(gearRequests),
    ...elecWarnings(mFA),
    ...waterWarnings(mFA),
  ];
  return warnings.length > 0;
}

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
export function generalErrors(fa: FA): string[] {
  return [
    hasName(fa.name),
    hasType(fa.type),
    hasTeam(fa.team_id),
    hasInCharge(fa.in_charge),
  ].filter((error): error is string => error !== true);
}

export function hasDescription(value: string | undefined): string | boolean {
  return (
    (!!value && value !== "<p></p>") || "L'animation n'a pas de description."
  );
}
export function hasDescriptionToPublish(fa: FA): string | boolean {
  if (!fa.faSitePublishAnimation) return true;
  return (
    !!fa.faSitePublishAnimation?.description ||
    "L'animation n'a pas de description à publier sur le site."
  );
}
export function hasPhotoLinkToPublish(fa: FA): string | boolean {
  if (!fa.faSitePublishAnimation) return true;
  return (
    !!fa.faSitePublishAnimation?.photoLink ||
    "L'animation n'a pas de photo à publier sur le site."
  );
}
export function hasCategoriesToPublish(fa: FA): string | boolean {
  if (!fa.faSitePublishAnimation) return true;
  return (
    (fa.faSitePublishAnimation?.categories &&
      fa.faSitePublishAnimation.categories.length > 0) ||
    "L'animation n'a pas de catégorie à publier sur le site."
  );
}
export function isPublishable(
  value: FaSitePublishAnimation | undefined
): string | boolean {
  return !!value || "L'animation ne sera pas publiée sur le site.";
}
export function detailErrors(fa: FA): string[] {
  return [
    hasDescriptionToPublish(fa),
    hasPhotoLinkToPublish(fa),
    hasCategoriesToPublish(fa),
  ].filter((error): error is string => error !== true);
}
export function detailWarnings(fa: FA): string[] {
  return [
    hasDescription(fa.description),
    isPublishable(fa.faSitePublishAnimation),
  ].filter((warning): warning is string => warning !== true);
}

export function hasLocation(value: number | undefined): string | boolean {
  return Boolean(value) || "L'animation n'a pas de localisation.";
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
    signaNeeds.every((signaNeed) => signaNeed.count > 0) ||
    "Chaque demande de signa doit avoir une quantité."
  );
}
export function signaErrors(fa: FA): string[] {
  return [
    hasLocation(fa.location_id),
    hasSignaNeedsWithQuantityHigherThanZero(fa.fa_signa_needs),
  ].filter((error): error is string => error !== true);
}
export function signaWarnings(fa: FA): string[] {
  return [hasSignaNeeds(fa.fa_signa_needs)].filter(
    (warning): warning is string => warning !== true
  );
}

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
export function timeWindowsErrors(fa: FA): string[] {
  return [hasAtLeastOneAnimationTimeWindow(fa.time_windows)].filter(
    (error): error is string => error !== true
  );
}

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
export function securityErrors(fa: FA): string[] {
  return [hasPassNumberHigherThanZero(fa)].filter(
    (error): error is string => error !== true
  );
}
export function securityWarnings(fa: FA): string[] {
  return [
    hasSecurityPassNeeds(fa.is_pass_required),
    hasSecurityNeeds(fa.security_needs),
  ].filter((error): error is string => error !== true);
}

export function isCollaboratorNotEmpty(
  collaborators: fa_collaborators[] | undefined
): string | boolean {
  return (
    (collaborators && collaborators?.length > 0) ||
    "Cette animation n'a pas de prestataire."
  );
}
export function hasCollaboratorMandatoryFieldsFilled(fa: FA): string | boolean {
  if (isCollaboratorNotEmpty(fa.fa_collaborators) !== true) return true;
  const { firstname, lastname, phone } = getCollaborator(fa.fa_collaborators)!;
  const hasMandatoryFieldsFilled = Boolean(firstname && lastname && phone);
  return (
    hasMandatoryFieldsFilled ||
    "Les informations obligatoires du prestataire sont incomplètes."
  );
}
export function hasCollaboratorOptionalFieldsFilled(
  collaborator: collaborator | undefined
): string | boolean {
  if (!collaborator) return true;
  const { email, company } = collaborator;
  const hasOptionalFieldsFilled = Boolean(email && company);
  return (
    hasOptionalFieldsFilled ||
    "Les informations optionnelles du prestataire sont incomplètes."
  );
}
function getCollaborator(
  collaborators: fa_collaborators[] | undefined
): collaborator | undefined {
  return collaborators?.[0]?.collaborator;
}
export function collaboratorErrors(fa: FA): string[] {
  return [hasCollaboratorMandatoryFieldsFilled(fa)].filter(
    (error): error is string => error !== true
  );
}
export function collaboratorWarnings(fa: FA): string[] {
  return [
    isCollaboratorNotEmpty(fa.fa_collaborators),
    hasCollaboratorOptionalFieldsFilled(getCollaborator(fa.fa_collaborators)),
  ].filter((warning): warning is string => warning !== true);
}

export function hasAtLeastOneMatosGearRequest(
  gearRequests: GearRequest<"FA">[]
): string | boolean {
  return (
    (gearRequests && gearRequests.length > 0) ||
    "L'animation n'a pas besoin de Matos."
  );
}
export function hasAtLeastOneBarrieresGearRequest(
  gearRequests: GearRequest<"FA">[]
): string | boolean {
  return (
    (gearRequests && gearRequests.length > 0) ||
    "L'animation n'a pas besoin de Barrières."
  );
}
export function hasAtLeastOneElecGearRequest(
  gearRequests: GearRequest<"FA">[]
): string | boolean {
  return (
    (gearRequests && gearRequests.length > 0) ||
    "L'animation n'a pas besoin de Matos Elec et Eau."
  );
}
export function hasMatosGearRequestWithQuantityHigherThanZero(
  matosGearRequests: GearRequest<"FA">[]
): string | boolean {
  return (
    matosGearRequests?.every((gearRequest) => gearRequest.quantity > 0) ||
    "Chaque matériel Matos doit avoir une quantité."
  );
}
export function hasBarrieresGearRequestWithQuantityHigherThanZero(
  barrieresGearRequests: GearRequest<"FA">[]
): string | boolean {
  return (
    barrieresGearRequests?.every((gearRequest) => gearRequest.quantity > 0) ||
    "Chaque matériel Barrières doit avoir une quantité."
  );
}
export function hasElecGearRequestWithQuantityHigherThanZero(
  elecGearRequests: GearRequest<"FA">[]
): string | boolean {
  return (
    elecGearRequests?.every((gearRequest) => gearRequest.quantity > 0) ||
    "Chaque matériel Elec doit avoir une quantité."
  );
}
export function gearRequestErrors(
  gearRequests: SortedStoredGearRequests
): string[] {
  return [
    hasMatosGearRequestWithQuantityHigherThanZero(gearRequests.matos),
    hasBarrieresGearRequestWithQuantityHigherThanZero(gearRequests.barrieres),
    hasElecGearRequestWithQuantityHigherThanZero(gearRequests.elec),
  ].filter((error): error is string => error !== true);
}
export function gearRequestWarnings(
  gearRequests: SortedStoredGearRequests
): string[] {
  return [
    hasAtLeastOneMatosGearRequest(gearRequests.matos),
    hasAtLeastOneBarrieresGearRequest(gearRequests.barrieres),
    hasAtLeastOneElecGearRequest(gearRequests.elec),
  ].filter((warning): warning is string => warning !== true);
}

export function hasElecNeeds(
  elecNeeds: fa_electricity_needs[] | undefined
): string | boolean {
  return (
    (elecNeeds && elecNeeds.length > 0) ||
    "L'animation n'a pas besoin d'électricité."
  );
}
export function elecWarnings(fa: FA): string[] {
  return [hasElecNeeds(fa.fa_electricity_needs)].filter(
    (warning): warning is string => warning !== true
  );
}

export function hasWaterNeeds(value: string | undefined): string | boolean {
  return !!value || "L'animation n'a pas besoin d'eau.";
}
export function waterWarnings(fa: FA): string[] {
  return [hasWaterNeeds(fa.water_needs)].filter(
    (warning): warning is string => warning !== true
  );
}
