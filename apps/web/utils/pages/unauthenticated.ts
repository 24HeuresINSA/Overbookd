import type { RouteLocationNormalized } from "vue-router";

export const unauthenticatedPages = ["login", "register", "reset"];

export function needToBeLoggedIn(to: RouteLocationNormalized): boolean {
  const target = to.name;
  if (!target) return false;
  return !unauthenticatedPages.some((page) => target.toString().includes(page));
}
