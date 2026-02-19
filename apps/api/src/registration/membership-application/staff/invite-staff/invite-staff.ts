import { jwtDecode } from "jwt-decode";
import jwt from "jsonwebtoken";
import {
  formatDateWithExplicitMonthAndDay,
  ONE_SECOND_IN_MS,
} from "@overbookd/time";
import { LOGIN_URL } from "@overbookd/web-page";
import { LINK_EXPIRED } from "@overbookd/configuration";

export type WithExpiration = {
  exp: number;
};

export const TOKEN = "token";

type LinkGeneration = {
  domain: string;
  secret: string;
};

type CheckInvitation = {
  token: string;
  secret: string;
};

export class InviteStaff {
  static async byLink({ domain, secret }: LinkGeneration): Promise<URL> {
    const baseUrl = new URL(`https://${domain}${LOGIN_URL}`);

    const token = jwt.sign({}, secret, { expiresIn: "30d" });

    baseUrl.searchParams.append(TOKEN, token);
    return baseUrl;
  }

  static isLinkExpired(link: URL): string {
    const token = link.searchParams.get(TOKEN);

    try {
      const { exp } = jwtDecode<WithExpiration>(token ?? "");
      const expirationInMs = exp * ONE_SECOND_IN_MS;

      if (InviteStaff.isPast(expirationInMs)) return LINK_EXPIRED;

      const expirationDate = formatDateWithExplicitMonthAndDay(expirationInMs);
      return `Le lien expire le ${expirationDate}`;
    } catch {
      return LINK_EXPIRED;
    }
  }

  static async isInvitationValid({ token, secret }: CheckInvitation) {
    try {
      jwt.verify(token, secret);
      return true;
    } catch {
      return false;
    }
  }

  private static isPast(expirationInMs: number) {
    return expirationInMs < Date.now();
  }
}
