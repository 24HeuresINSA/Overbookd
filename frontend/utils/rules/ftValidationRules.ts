import { FASimplified } from "../models/FA";
import { FT, FTTimeWindow } from "../models/ft";
import { SignaLocation } from "../models/signaLocation";
import { Team } from "../models/team";
import { User } from "../models/user";

export function hasAtLeastOneFTError(mFT: FT): boolean {
  const errors = [
    ...generalErrors(mFT),
    ...parentFAErrors(mFT),
    ...detailErrors(mFT),
    ...timeWindowsErrors(mFT),
  ];
  return errors.length > 0;
}
export function hasAtLeastOneFTWarning(mFT: FT): boolean {
  const warnings = [...timeWindowsWarnings(mFT)];
  return warnings.length > 0;
}

function hasName(value: string | undefined): string | boolean {
  return !!value || "La tâche doit avoir un nom.";
}
function hasTeam(value: Team | undefined): string | boolean {
  return value !== null || "La tâche doit avoir une équipe associée.";
}
function hasUserInCharge(value: User | undefined): string | boolean {
  return value !== null || "La tâche doit avoir un responsable.";
}
function hasLocation(value: SignaLocation | undefined): string | boolean {
  return Boolean(value) || "La tâche doit avoir un lieu.";
}
export function generalErrors(ft: FT): string[] {
  return [
    hasName(ft.name),
    hasTeam(ft.team),
    hasUserInCharge(ft.userInCharge),
    hasLocation(ft.location),
  ].filter((error): error is string => error !== true);
}

function hasParentFA(fa: FASimplified | undefined): string | boolean {
  return Boolean(fa) || "La tâche doit avoir une FA asscoiée.";
}
export function parentFAErrors(ft: FT): string[] {
  return [hasParentFA(ft.fa)].filter(
    (error): error is string => error !== true
  );
}

function hasDescription(description: string | undefined): string | boolean {
  return Boolean(description) || "La tâche doit avoir une description.";
}
export function detailErrors(ft: FT): string[] {
  return [hasDescription(ft.description)].filter(
    (error): error is string => error !== true
  );
}

function hasAtLeastOneTimeWindow(
  timeWindows: FTTimeWindow[]
): string | boolean {
  return (
    timeWindows.length > 0 || "La tâche doit avoir au moins une plage horaire."
  );
}
function hasAtLeastOneUserRequestPerTimeWindow(
  timeWindows: FTTimeWindow[]
): string | boolean {
  return (
    timeWindows.every((tw) => tw.userRequests.length > 0) ||
    "Tu as des créneaux sans demande de bénévole précis."
  );
}
function hasAtLeastOneTeamRequestPerTimeWindow(
  timeWindows: FTTimeWindow[]
): string | boolean {
  return (
    timeWindows.every((tw) => tw.teamRequests.length > 0) ||
    "Tu as des créneaux sans demande de bénévole d'une équipe."
  );
}
function hasAtLeastOneUserOrTeamRequestPerTimeWindow(
  timeWindows: FTTimeWindow[]
): string | boolean {
  return (
    timeWindows.every(
      (tw) => tw.userRequests.length > 0 || tw.teamRequests.length > 0
    ) || "Tu as des créneaux sans demande de bénévole."
  );
}
export function timeWindowsErrors(ft: FT): string[] {
  return [
    hasAtLeastOneTimeWindow(ft.timeWindows),
    hasAtLeastOneUserOrTeamRequestPerTimeWindow(ft.timeWindows),
  ].filter((error): error is string => error !== true);
}
export function timeWindowsWarnings(ft: FT): string[] {
  return [
    hasAtLeastOneUserRequestPerTimeWindow(ft.timeWindows),
    hasAtLeastOneTeamRequestPerTimeWindow(ft.timeWindows),
  ].filter((warning): warning is string => warning !== true);
}
