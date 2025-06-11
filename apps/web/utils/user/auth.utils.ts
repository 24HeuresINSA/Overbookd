import { ONE_SECOND_IN_MS } from "@overbookd/time";
import { jwtDecode } from "jwt-decode";

export type Token = { exp: number };

export function getTokenExpirationInMs(tokenStr: string): number {
  try {
    const { exp } = jwtDecode<Token>(tokenStr);
    return exp * ONE_SECOND_IN_MS;
  } catch {
    return 0;
  }
}

export function isTokenValid(tokenStr: string): boolean {
  const expiration = getTokenExpirationInMs(tokenStr);
  return expiration > Date.now();
}
