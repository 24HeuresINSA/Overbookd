import { jwtDecode } from "jwt-decode";
import jwt from "jsonwebtoken";
import { ONE_SECOND_IN_MS } from "@overbookd/period";

export type WithExpiration = {
  exp: number;
};

export const TOKEN = "token";
export const LINK_EXPIRED = "Le lien a expire";

type LinkGeneration = {
  domain: string;
  secret: string;
};

type CheckInvitation = {
  token: string;
  secret: string;
};

export class InviteNewAdherents {
  static byLink({ domain, secret }: LinkGeneration): URL {
    const baseUrl = new URL(`https://${domain}/register`);
    const token = jwt.sign({}, secret, { expiresIn: "30 days" });
    baseUrl.searchParams.append(TOKEN, token);
    return baseUrl;
  }

  static isLinkExpired(link: URL): string {
    const token = link.searchParams.get(TOKEN);

    try {
      const { exp } = jwtDecode<WithExpiration>(token ?? "");
      const expirationInMs = exp * ONE_SECOND_IN_MS;

      if (InviteNewAdherents.isPast(expirationInMs)) return LINK_EXPIRED;

      const expirationDate =
        InviteNewAdherents.formatDateWithExplicitMonthAndDay(expirationInMs);

      return `Le lien expire le ${expirationDate}`;
    } catch {
      return LINK_EXPIRED;
    }
  }

  static isInvitationValid({ token, secret }: CheckInvitation) {
    try {
      jwt.verify(token, secret, { ignoreExpiration: false });
      return true;
    } catch {
      return false;
    }
  }

  private static isPast(expirationInMs: number) {
    return expirationInMs < Date.now();
  }

  private static formatDateWithExplicitMonthAndDay(date: number): string {
    const displayOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Intl.DateTimeFormat("fr", displayOptions).format(new Date(date));
  }
}
