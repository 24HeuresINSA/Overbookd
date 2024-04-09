import { describe, expect, it } from "vitest";
import { ONE_HOUR_IN_MS, QUARTER_IN_MS } from "@overbookd/period";
import { Period } from "@overbookd/period";
import { CalculeVolunteerAssignmentDuration } from "./volunteer-assignment-duration";

const friday08hTo10h = Period.init({
  start: new Date("2022-07-01T08:00:00Z"),
  end: new Date("2022-07-01T10:00:00Z"),
});
const friday11hTo14h = Period.init({
  start: new Date("2022-07-01T11:00:00Z"),
  end: new Date("2022-07-01T14:00:00Z"),
});
const friday15h15To18h = Period.init({
  start: new Date("2022-07-01T15:15:00Z"),
  end: new Date("2022-07-01T18:00:00Z"),
});

describe("Calcule volunteer assignment duration", () => {
  describe.each`
    explaination                | assignments                                           | expectedDuration
    ${"with one assignment"}    | ${[friday08hTo10h]}                                   | ${2 * ONE_HOUR_IN_MS}
    ${"with two assignments"}   | ${[friday08hTo10h, friday11hTo14h]}                   | ${5 * ONE_HOUR_IN_MS}
    ${"with three assignments"} | ${[friday08hTo10h, friday11hTo14h, friday15h15To18h]} | ${7 * ONE_HOUR_IN_MS + 3 * QUARTER_IN_MS}
  `(
    "when calculating expected assignment duration $explaination",
    ({ assignments, expectedDuration }) => {
      it("should return the duration of the assignments", () => {
        const duration =
          CalculeVolunteerAssignmentDuration.fromPeriods(assignments);
        expect(duration).toBe(expectedDuration);
      });
    },
  );
});
