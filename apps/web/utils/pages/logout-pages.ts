import type { RouteLocationNormalized } from "vue-router";

export const pagesWithoutLogin = ["login", "register"];

export function needToBeLoggedIn(to: RouteLocationNormalized): boolean {
  const target = to.name;
  if (!target) return false;
  return !pagesWithoutLogin.includes(target.toString());
}
