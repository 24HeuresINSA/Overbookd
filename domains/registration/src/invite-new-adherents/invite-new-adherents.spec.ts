import { describe, expect, it } from "vitest";
import jwt_decode from "jwt-decode";
import { ONE_DAY_IN_MS, ONE_SECOND_IN_MS } from "@overbookd/period";
import {
  InviteNewAdherents,
  LINK_EXPIRED,
  TOKEN,
  WithExpiration,
} from "./invite-new-adherents";

const domain = "https://test.com";
const secret = "secret";

describe("Invite new adherents", () => {
  describe("when inviting new adherents", () => {
    it("should expose a link", () => {
      const link = InviteNewAdherents.byLink({ domain, secret });
      expect(link instanceof URL).toBe(true);
    });
    it("should expose url according to given domain", () => {
      const link = InviteNewAdherents.byLink({ domain, secret });
      expect(link.origin).toBe(domain);
    });
    it("should expose a jwt token as parameter", () => {
      const link = InviteNewAdherents.byLink({ domain, secret });
      const token = link.searchParams.get(TOKEN);
      expect(() => jwt_decode(token ?? "")).not.toThrow();
    });
    it("should generate a jwt token with a 30 days expiration", () => {
      const now = Date.now();
      const in29Days = now + 29 * ONE_DAY_IN_MS;
      const in31Days = now + 31 * ONE_DAY_IN_MS;

      const link = InviteNewAdherents.byLink({ domain, secret });
      const token = link.searchParams.get(TOKEN);
      const { exp } = jwt_decode<WithExpiration>(token ?? "");
      const expirationInMs = exp * ONE_SECOND_IN_MS;

      expect(expirationInMs).toBeGreaterThan(in29Days);
      expect(expirationInMs).toBeLessThan(in31Days);
    });
  });
  describe("when checking link expiration", () => {
    describe("when link is not expired yet", () => {
      const validLink = InviteNewAdherents.byLink({ domain, secret });
      const expireText = new RegExp(
        "Le lien expire le [1-9][0-9]? [a-z]+ 2[0-9]{3}",
      );
      it("should indicate when link will expire", () => {
        expect(InviteNewAdherents.isLinkExpired(validLink)).toMatch(expireText);
      });
    });
    describe("when link is not a valid link", () => {
      it("should consider link as expired", () => {
        const invalidLink = new URL(`${domain}`);
        expect(InviteNewAdherents.isLinkExpired(invalidLink)).toBe(
          LINK_EXPIRED,
        );

        const linkWithInvalidToken = new URL(
          `${domain}?${TOKEN}=vdtqfdqwda.adgqeugfkabd.fdaghuida`,
        );
        expect(InviteNewAdherents.isLinkExpired(linkWithInvalidToken)).toBe(
          LINK_EXPIRED,
        );
      });
    });
    describe("when link is expired", () => {
      it("should indicate link as expired", () => {
        const expiredToken =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTI3NDg4MDB9.AHZulnYZM0aRLcWZEsQu6aJY3mc4L-InYzk3gJYLQI8";
        const expiredLink = new URL(`${domain}?${TOKEN}=${expiredToken}`);
        expect(InviteNewAdherents.isLinkExpired(expiredLink)).toBe(
          LINK_EXPIRED,
        );
      });
    });
  });
});
