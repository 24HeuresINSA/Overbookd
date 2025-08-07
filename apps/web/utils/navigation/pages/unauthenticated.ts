import { LOGIN_URL, REGISTER_URL } from "@overbookd/web-page";
import type { RouteLocationNormalized } from "vue-router";

export const unauthenticatedPages = [LOGIN_URL, REGISTER_URL];

export function isUnprotectedRoute(to: RouteLocationNormalized): boolean {
  return unauthenticatedPages.includes(to.path);
}
