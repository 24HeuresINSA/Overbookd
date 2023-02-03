import { FASimplified } from "../models/FA";
import { FT, FTTimeWindow } from "../models/ft";
import { SignaLocation } from "../models/signaLocation";
import { Team } from "../models/team";
import { User } from "../models/user";

export function hasAtLeastOneFTError(mFT: FT): boolean {
  const errors = [
    ...ftGeneralErrors(mFT),
    ...ftParentFAErrors(mFT),
    ...ftDetailErrors(mFT),
    ...ftTimeWindowsErrors(mFT),
  ];
  return errors.length > 0;
}

function hasName(name?: string): string | boolean {
  return Boolean(name) || "La tâche doit avoir un nom.";
}
function hasTeam(team?: Team): string | boolean {
  return Boolean(team) || "La tâche doit avoir une équipe associée.";
}
function hasUserInCharge(user?: User): string | boolean {
  return Boolean(user) || "La tâche doit avoir un responsable.";
}
function hasLocation(location?: SignaLocation): string | boolean {
  return Boolean(location) || "La tâche doit avoir un lieu.";
}
export function ftGeneralErrors(ft: FT): string[] {
  return [
    hasName(ft.name),
    hasTeam(ft.team),
    hasUserInCharge(ft.userInCharge),
    hasLocation(ft.location),
  ].filter((error): error is string => error !== true);
}

function hasParentFA(fa?: FASimplified): string | boolean {
  return Boolean(fa) || "La tâche doit avoir une FA asscoiée.";
}
export function ftParentFAErrors(ft: FT): string[] {
  return [hasParentFA(ft.fa)].filter(
    (error): error is string => error !== true
  );
}

function hasDescription(description: string): string | boolean {
  return (
    (Boolean(description) && description !== "<p></p>") ||
    "La tâche doit avoir une description."
  );
}
export function ftDetailErrors(ft: FT): string[] {
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
function hasAtLeastOneUserOrTeamRequestPerTimeWindow(
  timeWindows: FTTimeWindow[]
): string | boolean {
  return (
    timeWindows.every(
      (tw) => tw.userRequests.length > 0 || tw.teamRequests.length > 0
    ) || "Tu as des créneaux sans demande de bénévole."
  );
}
export function ftTimeWindowsErrors(ft: FT): string[] {
  return [
    hasAtLeastOneTimeWindow(ft.timeWindows),
    hasAtLeastOneUserOrTeamRequestPerTimeWindow(ft.timeWindows),
  ].filter((error): error is string => error !== true);
}
