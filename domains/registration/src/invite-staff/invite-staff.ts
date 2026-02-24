import { jwtDecode } from "jwt-decode";
import {
  formatDateWithExplicitMonthAndDay,
  ONE_SECOND_IN_MS,
} from "@overbookd/time";
import { LOGIN_URL } from "@overbookd/web-page";

export type WithExpiration = {
  exp: number;
};

export const TOKEN = "token";
export const LINK_EXPIRED = "Le lien a expiré";
export const JWT_EXPIRES_IN = "30d" as const;

type LinkGeneration = {
  domain: string;
  token: string;
};

export class InviteStaff {
  static byLink({ domain, token }: LinkGeneration): URL {
    const baseUrl = new URL(`https://${domain}${LOGIN_URL}`);
    baseUrl.searchParams.append(TOKEN, token);
    return baseUrl;
  }

  static isTokenExpired(token: string): string {
    try {
      const { exp } = jwtDecode<WithExpiration>(token);
      const expirationInMs = exp * ONE_SECOND_IN_MS;

      if (InviteStaff.isPast(expirationInMs)) return LINK_EXPIRED;

      const expirationDate = formatDateWithExplicitMonthAndDay(expirationInMs);
      return `Le lien expire le ${expirationDate}`;
    } catch {
      return LINK_EXPIRED;
    }
  }

  static isLinkExpired(link: URL): string {
    const token = link.searchParams.get(TOKEN);
    if (!token) return LINK_EXPIRED;
    return InviteStaff.isTokenExpired(token);
  }

  private static isPast(expirationInMs: number) {
    return expirationInMs < Date.now();
  }
}
