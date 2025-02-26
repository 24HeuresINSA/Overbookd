import { BENEVOLE_CODE, HARD_CODE, SOFT_CODE } from "@overbookd/team-constants";
import { beforeEach, describe, expect, it } from "vitest";
import {
  AlreadyEnrolledError,
  Candidate,
  CANDIDATE_ENROLLED,
  EnrollCandidates,
} from "./enroll-candidates.js";
import { InMemoryMemberships } from "./memberships.inmemory.js";
import { InMemoryEvents } from "./events.inmemory.js";
import { IProvidePeriod } from "@overbookd/time";
import { OverDate } from "@overbookd/time";
import { InMemoryBriefingAvailabilities } from "./availabilitites.inmemory.js";

const shogosse = { id: 1, name: "Lea (Shogosse) Mauyno" };
const noel = { id: 2, name: "Noel Ertsemud" };
const antony = { id: 3, name: "Antony (Dracoon) Pirony" };
const samuel = { id: 4, name: "Samuel Lareine" };
const valerie = { id: 5, name: "Valerie (Val) Basdufront" };

const briefTimeWindow: IProvidePeriod = {
  start: OverDate.init({ date: "2025-05-18", hour: 18 }).date,
  end: OverDate.init({ date: "2025-05-18", hour: 20 }).date,
};

let enrollCandidates: EnrollCandidates;
let memberships: InMemoryMemberships;
let events: InMemoryEvents;
let availabilities: InMemoryBriefingAvailabilities;

describe("Enroll candidates to a joinable team", () => {
  beforeEach(() => {
    memberships = new InMemoryMemberships();
    events = new InMemoryEvents();
    availabilities = new InMemoryBriefingAvailabilities();
    enrollCandidates = new EnrollCandidates(
      memberships,
      events,
      availabilities,
    );
  });
  describe.each<{ candidates: Candidate[]; names: string }>([
    { candidates: [shogosse], names: shogosse.name },
    {
      candidates: [shogosse, noel, antony],
      names: `${shogosse.name}, ${noel.name} and ${antony.name}`,
    },
  ])('when enrolling $names to "hard" team', ({ candidates }) => {
    it("should apply without issues", async () => {
      await expect(enrollCandidates.applyAsHard(candidates)).resolves.ok;
    });
    it(`should set all candidates as "hard" members`, async () => {
      await enrollCandidates.applyAsHard(candidates);
      candidates.every((candidate) =>
        expect(memberships.membersOf(HARD_CODE).includes(candidate)).toBe(true),
      );
    });
    it(`should publish ${candidates.length} enrolled candidates event(s)`, async () => {
      await enrollCandidates.applyAsHard(candidates);
      expect(events.all).toHaveLength(candidates.length);
    });
    it(`should list all candidates as ${BENEVOLE_CODE} members`, async () => {
      await enrollCandidates.applyAsHard(candidates);
      candidates.every((candidate) =>
        expect(memberships.membersOf(BENEVOLE_CODE).includes(candidate)).toBe(
          true,
        ),
      );
    });
  });
  describe.each<{ candidates: Candidate[]; names: string }>([
    { candidates: [samuel], names: samuel.name },
    {
      candidates: [samuel, valerie],
      names: `${samuel.name} and ${valerie.name}`,
    },
  ])('when enrolling $names to "soft" team', ({ candidates }) => {
    it("should apply without issues", async () => {
      await expect(enrollCandidates.applyAsSoft(candidates, briefTimeWindow))
        .resolves.ok;
    });
    it(`should set all candidates as "soft" members`, async () => {
      await enrollCandidates.applyAsSoft(candidates, briefTimeWindow);
      candidates.every((candidate) =>
        expect(memberships.membersOf(SOFT_CODE).includes(candidate)).toBe(true),
      );
    });
    it(`should publish ${candidates.length} enrolled candidates event(s)`, async () => {
      await enrollCandidates.applyAsSoft(candidates, briefTimeWindow);
      expect(events.all).toHaveLength(candidates.length);
    });
    it(`should list all candidates as ${BENEVOLE_CODE} members`, async () => {
      await enrollCandidates.applyAsSoft(candidates, briefTimeWindow);
      candidates.every((candidate) =>
        expect(memberships.membersOf(BENEVOLE_CODE).includes(candidate)).toBe(
          true,
        ),
      );
    });
    it("should add availabilitites for volunteer briefing", async () => {
      await enrollCandidates.applyAsSoft(candidates, briefTimeWindow);
      candidates.every((candidate) =>
        expect(availabilities.availabilitiesOf(candidate.id)).toContainEqual(
          briefTimeWindow,
        ),
      );
    });
  });
  describe("when enrolling some candidates as hard and then some as soft", () => {
    it("should list all candidates as benevole", async () => {
      const hardCandidates = [shogosse, noel];
      const softCandidates = [samuel, valerie];
      await enrollCandidates.applyAsHard(hardCandidates);
      await enrollCandidates.applyAsSoft(softCandidates, briefTimeWindow);
      const allCandidates = [...hardCandidates, ...softCandidates];
      allCandidates.every((candidate) =>
        expect(memberships.membersOf(BENEVOLE_CODE).includes(candidate)).toBe(
          true,
        ),
      );
    });
  });
  describe("when enrolling candidates with at least one of them already enrolled on the other team", () => {
    beforeEach(() => {
      memberships = new InMemoryMemberships(
        new Map([
          ["hard", [shogosse]],
          ["soft", [samuel, valerie]],
          [BENEVOLE_CODE, [shogosse, samuel, valerie]],
        ]),
      );
      enrollCandidates = new EnrollCandidates(
        memberships,
        events,
        availabilities,
      );
    });
    describe("when trying to enroll as hard", () => {
      const candidates = [antony, samuel];
      const alreadyEnrolled = [samuel];
      it("should indicate some candidates are already enrolled", async () => {
        await expect(enrollCandidates.applyAsHard(candidates)).rejects.toThrow(
          new AlreadyEnrolledError(alreadyEnrolled),
        );
      });
    });
    describe("when trying to enroll as soft", () => {
      memberships = new InMemoryMemberships(
        new Map([
          ["hard", [shogosse, valerie]],
          [BENEVOLE_CODE, [shogosse, valerie]],
        ]),
      );
      enrollCandidates = new EnrollCandidates(
        memberships,
        events,
        availabilities,
      );
      const candidates = [shogosse, antony];
      const alreadyEnrolled = [shogosse];
      it("should indicate some candidates are already enrolled", async () => {
        await expect(
          enrollCandidates.applyAsSoft(candidates, briefTimeWindow),
        ).rejects.toThrow(new AlreadyEnrolledError(alreadyEnrolled));
      });
    });
  });

  describe("when enrolling candidates with at least on of them already enrolled on the same team", () => {
    beforeEach(() => {
      memberships = new InMemoryMemberships(
        new Map([
          ["hard", [shogosse]],
          ["soft", [samuel, valerie]],
          [BENEVOLE_CODE, [shogosse, samuel, valerie]],
        ]),
      );
      enrollCandidates = new EnrollCandidates(
        memberships,
        events,
        availabilities,
      );
    });
    const candidates = [shogosse, noel];
    it("should apply without issue", async () => {
      await expect(enrollCandidates.applyAsHard(candidates)).resolves.ok;
    });
    it("should generate enrolled candidate event only for candidates not already enrolled", async () => {
      const data = { candidate: noel, team: "hard" };
      const expectedEvent = { type: CANDIDATE_ENROLLED, data };

      await enrollCandidates.applyAsHard(candidates);

      expect(events.all).toHaveLength(1);
      expect(events.all).toContainEqual(expectedEvent);
    });
    it('should list all candidates as "hard" team member', async () => {
      await enrollCandidates.applyAsHard(candidates);
      expect(memberships.membersOf("hard")).toContainEqual(noel);
      expect(memberships.membersOf("hard")).toContainEqual(shogosse);
    });
  });
});
