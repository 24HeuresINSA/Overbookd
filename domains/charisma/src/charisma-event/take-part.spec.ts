import { describe, it, expect, beforeEach } from "vitest";
import {
  InsufficientCharismaPerHour,
  IntegerCharismaPerHour,
  InvalidName,
  InvalidParticipantHours,
  NoParticipant,
  SameParticipantMultipleTimes,
} from "./charisma-event.error";
import { CharismaEvent } from "./charisma-event";
import { User } from "@overbookd/user";
import { InMemoryCharismaEventParticipations } from "./charisma-event-participations.inmemory";

const lea: User = {
  id: 1,
  firstname: "Lea",
  lastname: "Mouyno",
};
const cul: User = {
  id: 2,
  firstname: "Cul",
  lastname: "Nehgahrednav",
};

const eventDate1 = new Date("2024-01-01");
const eventDate2 = new Date("2025-06-02");

const oneParticipant = [{ id: lea.id, hours: 2 }];
const expectedEventWithOneParticipant = [
  {
    slug: "event-with-one-participant",
    name: "Event with one participant",
    participant: lea,
    charisma: 20,
    eventDate: eventDate1,
  },
];

const twoParticipants = [
  { id: lea.id, hours: 1 },
  { id: cul.id, hours: 4 },
];
const expectedEventWithTwoParticipants = [
  {
    slug: "event-with-two-participants",
    name: "Event with two participants",
    participant: lea,
    charisma: 5,
    eventDate: eventDate2,
  },
  {
    slug: "event-with-two-participants",
    name: "Event with two participants",
    participant: cul,
    charisma: 20,
    eventDate: eventDate2,
  },
];

describe("Take part in Charisma Event", () => {
  let charismaEvents: InMemoryCharismaEventParticipations;
  let takePart: CharismaEvent;

  beforeEach(() => {
    charismaEvents = new InMemoryCharismaEventParticipations([lea, cul], []);
    takePart = new CharismaEvent(charismaEvents);
  });

  describe.each`
    name    | charismaPerHour | eventDate     | participants
    ${""}   | ${10}           | ${eventDate1} | ${oneParticipant}
    ${" ?"} | ${10}           | ${eventDate1} | ${oneParticipant}
  `(
    "when name $name generates an empty slug",
    ({ name, charismaPerHour, eventDate, participants }) => {
      it("should indicate that the name is not valid", () => {
        const eventForm = { name, charismaPerHour, eventDate };
        const apply = () => takePart.takePart(eventForm, participants);
        expect(apply).rejects.toThrow(InvalidName);
      });
    },
  );

  describe.each`
    name                                 | charismaPerHour | eventDate     | participants      | expectedError
    ${"Event with negative charisma"}    | ${-10}          | ${eventDate1} | ${oneParticipant} | ${InsufficientCharismaPerHour}
    ${"Event with null charisma"}        | ${0}            | ${eventDate1} | ${oneParticipant} | ${InsufficientCharismaPerHour}
    ${"Event with not integer charisma"} | ${1.5}          | ${eventDate1} | ${oneParticipant} | ${IntegerCharismaPerHour}
  `(
    "when taking part in $name",
    ({ name, charismaPerHour, eventDate, participants, expectedError }) => {
      it("should indicate that the charisma per hour is not valid", () => {
        const eventForm = { name, charismaPerHour, eventDate };
        const apply = () => takePart.takePart(eventForm, participants);
        expect(apply).rejects.toThrow(expectedError);
      });
    },
  );

  describe("when participants are invalid", () => {
    const eventForm = {
      name: "Event",
      charismaPerHour: 10,
      eventDate: eventDate1,
    };
    describe("when participants are empty", () => {
      it("should indicate that participants are required", () => {
        const apply = () => takePart.takePart(eventForm, []);
        expect(apply).rejects.toThrow(NoParticipant);
      });
    });
    describe("when at least one participant has a null or negative number of hours", () => {
      it("should indicate that hours should be positive", () => {
        const participants = [{ id: lea.id, hours: 0 }];
        const apply = () => takePart.takePart(eventForm, participants);
        expect(apply).rejects.toThrow(InvalidParticipantHours);
      });
    });
    describe("when there are same participants multiple times", () => {
      it("should indicate that participants should be unique", () => {
        const participants = [
          { id: lea.id, hours: 1 },
          { id: lea.id, hours: 2 },
        ];
        const apply = () => takePart.takePart(eventForm, participants);
        expect(apply).rejects.toThrow(SameParticipantMultipleTimes);
      });
    });
    describe("when event already exists for participants", () => {
      it("should indicate that event already exists", async () => {
        await takePart.takePart(eventForm, oneParticipant);
        const apply = () => takePart.takePart(eventForm, oneParticipant);
        expect(apply).rejects.toThrow(
          "Lea Mouyno participe(nt) déjà à cet évènement",
        );
      });
    });
  });

  describe.each`
    name                             | charismaPerHour | eventDate     | participants       | expected
    ${"Event with one participant"}  | ${10}           | ${eventDate1} | ${oneParticipant}  | ${expectedEventWithOneParticipant}
    ${"Event with two participants"} | ${5}            | ${eventDate2} | ${twoParticipants} | ${expectedEventWithTwoParticipants}
  `(
    "when creating $name",
    ({ name, charismaPerHour, eventDate, participants, expected }) => {
      it("should return the created event", async () => {
        const eventForm = { name, charismaPerHour, eventDate };
        const result = await takePart.takePart(eventForm, participants);
        expect(result).toEqual(expected);
      });
    },
  );
});
