import { describe, expect, it } from "vitest";
import { Charisma } from "./charisma";

const friday08hto09h = {
  start: new Date("2024-05-17T08:00+02:00"),
  end: new Date("2024-05-17T09:00+02:00"),
};
const friday09hto10h = {
  start: new Date("2024-05-17T09:00+02:00"),
  end: new Date("2024-05-17T10:00+02:00"),
};
const friday08hto10h = {
  start: new Date("2024-05-17T08:00+02:00"),
  end: new Date("2024-05-17T10:00+02:00"),
};
const friday10hto11h = {
  start: new Date("2024-05-17T10:00+02:00"),
  end: new Date("2024-05-17T11:00+02:00"),
};
const friday08hto11h = {
  start: new Date("2024-05-17T08:00+02:00"),
  end: new Date("2024-05-17T11:00+02:00"),
};
const friday08hto12h = {
  start: new Date("2024-05-17T08:00+02:00"),
  end: new Date("2024-05-17T12:00+02:00"),
};

const friday08hto10hCharisma10 = {
  ...friday08hto10h,
  charisma: 10,
};
const friday10hto11hCharisma20 = {
  ...friday10hto11h,
  charisma: 20,
};

describe("Calculate charisma", () => {
  describe.each`
    events                                  | expected
    ${[]}                                   | ${0}
    ${[{ charisma: 10 }]}                   | ${10}
    ${[{ charisma: 10 }, { charisma: 20 }]} | ${30}
  `("when there are $events.length events", ({ events, expected }) => {
    it("should return the right charisma", () => {
      const charisma = Charisma.init().addEvents(events).calculate();
      expect(charisma).toBe(expected);
    });
  });

  describe.each`
    availabilities                      | periods                                                 | expected
    ${[]}                               | ${[]}                                                   | ${0}
    ${[]}                               | ${[friday08hto10hCharisma10]}                           | ${0}
    ${[friday08hto09h]}                 | ${[]}                                                   | ${0}
    ${[friday08hto09h]}                 | ${[friday08hto10hCharisma10]}                           | ${10}
    ${[friday08hto09h, friday09hto10h]} | ${[friday08hto10hCharisma10]}                           | ${20}
    ${[friday08hto11h]}                 | ${[friday08hto10hCharisma10, friday10hto11hCharisma20]} | ${40}
    ${[friday08hto12h]}                 | ${[friday10hto11hCharisma20]}                           | ${20}
    ${[friday08hto12h]}                 | ${[friday08hto10hCharisma10, friday10hto11hCharisma20]} | ${40}
  `(
    "when there are $availabilities.length availabilities and $periods.length periods",
    ({ availabilities, periods, expected }) => {
      it("should return the right charisma", () => {
        const charisma = Charisma.init()
          .addAvailabilities(availabilities, periods)
          .calculate();
        expect(charisma).toBe(expected);
      });
    },
  );

  describe("when there are events, availabilities and periods", () => {
    it("should return the right charisma", () => {
      const charisma = Charisma.init()
        .addEvents([{ charisma: 10 }])
        .addAvailabilities([friday08hto09h], [friday08hto10hCharisma10])
        .calculate();
      expect(charisma).toBe(20);
    });
  });
});
