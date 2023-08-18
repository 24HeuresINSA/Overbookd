import { BaseFa } from "../models/fa.model";
import { Ft, FtTimeWindow } from "../models/ft.model";
import { SignaLocation } from "../models/signa-location.model";
import { Team } from "../models/team";
import { User } from "../models/user";

export function hasAtLeastOneFTError(mFT: Ft): boolean {
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
export function ftGeneralErrors(ft: Ft): string[] {
  return [
    hasName(ft.name),
    hasTeam(ft.team),
    hasUserInCharge(ft.userInCharge),
    hasLocation(ft.location),
  ].filter((error): error is string => error !== true);
}

function hasParentFA(fa?: BaseFa): string | boolean {
  return Boolean(fa) || "La tâche doit avoir une FA asscoiée.";
}
export function ftParentFAErrors(ft: Ft): string[] {
  return [hasParentFA(ft.fa)].filter(
    (error): error is string => error !== true,
  );
}

function hasDescription(description: string): string | boolean {
  return (
    (Boolean(description) && description !== "<p></p>") ||
    "La tâche doit avoir une description."
  );
}
export function ftDetailErrors(ft: Ft): string[] {
  return [hasDescription(ft.description)].filter(
    (error): error is string => error !== true,
  );
}

function hasAtLeastOneTimeWindow(
  timeWindows: FtTimeWindow[],
): string | boolean {
  return (
    timeWindows.length > 0 || "La tâche doit avoir au moins une plage horaire."
  );
}
function hasAtLeastOneUserOrTeamRequestPerTimeWindow(
  timeWindows: FtTimeWindow[],
): string | boolean {
  return (
    timeWindows.every(
      (tw) => tw.userRequests.length > 0 || tw.teamRequests.length > 0,
    ) || "Tu as des créneaux sans demande de bénévole."
  );
}
export function ftTimeWindowsErrors(ft: Ft): string[] {
  return [
    hasAtLeastOneTimeWindow(ft.timeWindows),
    hasAtLeastOneUserOrTeamRequestPerTimeWindow(ft.timeWindows),
  ].filter((error): error is string => error !== true);
}
