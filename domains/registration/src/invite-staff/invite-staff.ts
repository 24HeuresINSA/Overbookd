import { jwtDecode } from "jwt-decode";
import { SignJWT, jwtVerify } from "jose";
import { ONE_SECOND_IN_MS } from "@overbookd/time";

export type WithExpiration = {
  exp: number;
};

export const TOKEN = "token";
export const LINK_EXPIRED = "Le lien a expiré";

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
    const baseUrl = new URL(`https://${domain}/register`);
    const secretKey = new TextEncoder().encode(secret);
    const token = await new SignJWT()
      .setExpirationTime("30 days")
      .setProtectedHeader({ alg: "HS256" })
      .sign(secretKey);
    baseUrl.searchParams.append(TOKEN, token);
    return baseUrl;
  }

  static isLinkExpired(link: URL): string {
    const token = link.searchParams.get(TOKEN);

    try {
      const { exp } = jwtDecode<WithExpiration>(token ?? "");
      const expirationInMs = exp * ONE_SECOND_IN_MS;

      if (InviteStaff.isPast(expirationInMs)) return LINK_EXPIRED;

      const expirationDate =
        InviteStaff.formatDateWithExplicitMonthAndDay(expirationInMs);

      return `Le lien expire le ${expirationDate}`;
    } catch {
      return LINK_EXPIRED;
    }
  }

  static async isInvitationValid({ token, secret }: CheckInvitation) {
    try {
      const secretKey = new TextEncoder().encode(secret);
      await jwtVerify(token, secretKey);
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
