import { User } from "../models/repo";

/**
 * Check if the user has at least one of the roles.
 * @param user The user to check
 * @param roles The roles to check
 * @returns true if at least one match
 */
export function hasRole(user: User, roles: string[] | string) {
  if (roles === undefined) {
    return true;
  }

  const teams = user.team;
  if (teams === undefined) {
    return false;
  }
  if (typeof roles == "string") {
    roles = [roles];
  }
  return roles.some((r) => teams.includes(r));
}
