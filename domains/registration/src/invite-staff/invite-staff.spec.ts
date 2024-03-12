import { describe, expect, it } from "vitest";
import { jwtDecode } from "jwt-decode";
import { ONE_DAY_IN_MS, ONE_SECOND_IN_MS } from "@overbookd/period";
import {
  InviteStaff,
  LINK_EXPIRED,
  TOKEN,
  WithExpiration,
} from "./invite-staff";

const domain = "test.com";
const secret = "secret";

describe("Invite staff", () => {
  describe("when inviting staff", () => {
    it("should expose a link", () => {
      const link = InviteStaff.byLink({ domain, secret });
      expect(link instanceof URL).toBe(true);
    });
    it("should expose url according to given domain", () => {
      const link = InviteStaff.byLink({ domain, secret });
      expect(link.host).toBe(domain);
    });
    it("should expose a jwt token as parameter", () => {
      const link = InviteStaff.byLink({ domain, secret });
      const token = link.searchParams.get(TOKEN);
      expect(() => jwtDecode(token ?? "")).not.toThrow();
    });
    it("should generate a jwt token with a 30 days expiration", () => {
      const now = Date.now();
      const in29Days = now + 29 * ONE_DAY_IN_MS;
      const in31Days = now + 31 * ONE_DAY_IN_MS;

      const link = InviteStaff.byLink({ domain, secret });
      const token = link.searchParams.get(TOKEN);
      const { exp } = jwtDecode<WithExpiration>(token ?? "");
      const expirationInMs = exp * ONE_SECOND_IN_MS;

      expect(expirationInMs).toBeGreaterThan(in29Days);
      expect(expirationInMs).toBeLessThan(in31Days);
    });
  });
  describe("when checking link expiration", () => {
    describe("when link is not expired yet", () => {
      const validLink = InviteStaff.byLink({ domain, secret });
      const expireText = new RegExp(
        "Le lien expire le [1-9][0-9]? [a-zéû]+ 2[0-9]{3}",
      );
      it("should indicate when link will expire", () => {
        expect(InviteStaff.isLinkExpired(validLink)).toMatch(expireText);
      });
    });
    describe("when link is not a valid link", () => {
      it("should consider link as expired", () => {
        const invalidLink = new URL(`https://${domain}`);
        expect(InviteStaff.isLinkExpired(invalidLink)).toBe(LINK_EXPIRED);

        const linkWithInvalidToken = new URL(
          `https://${domain}?${TOKEN}=vdtqfdqwda.adgqeugfkabd.fdaghuida`,
        );
        expect(InviteStaff.isLinkExpired(linkWithInvalidToken)).toBe(
          LINK_EXPIRED,
        );
      });
    });
    describe("when link is expired", () => {
      it("should indicate link as expired", () => {
        const expiredToken =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTI3NDg4MDB9.AHZulnYZM0aRLcWZEsQu6aJY3mc4L-InYzk3gJYLQI8";
        const expiredLink = new URL(
          `https://${domain}?${TOKEN}=${expiredToken}`,
        );
        expect(InviteStaff.isLinkExpired(expiredLink)).toBe(LINK_EXPIRED);
      });
    });
  });
});
