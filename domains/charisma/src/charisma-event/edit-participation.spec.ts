import { beforeEach, describe, expect, it } from "vitest";
import { CharismaEvent } from "./charisma-event";
import { InMemoryCharismaEventParticipations } from "./charisma-event-participations.inmemory";
import { InexistentParticipation } from "./charisma-event.error";

const lea = { id: 1, firstname: "Lea", lastname: "Mouyno" };

const participationFromLea = {
  slug: "participation-from-lea",
  name: "Participation from Lea",
  participant: lea,
  charisma: 10,
  eventDate: "2024-01-01" as const,
};

describe("Edit Charisma Event Participation", () => {
  let charismaEvents: InMemoryCharismaEventParticipations;
  let takePart: CharismaEvent;

  beforeEach(() => {
    charismaEvents = new InMemoryCharismaEventParticipations(
      [lea],
      [participationFromLea],
    );
    takePart = new CharismaEvent(charismaEvents);
  });

  describe.each`
    slug                            | eventDate                         | participantId
    ${"non-existing-participation"} | ${participationFromLea.eventDate} | ${lea.id}
    ${participationFromLea.slug}    | ${"2023-10-08"}                   | ${lea.id}
    ${participationFromLea.slug}    | ${participationFromLea.eventDate} | ${200}
  `(
    "when the participation does not exist",
    ({ slug, eventDate, participantId }) => {
      const participationToEdit = {
        slug,
        eventDate,
        participantId,
        charisma: 10,
      };
      it("should indicate that the participation does not exist", async () => {
        const apply = () => takePart.editParticipation(participationToEdit);
        expect(apply).rejects.toThrow(InexistentParticipation);
      });
    },
  );

  describe("when the participation exists", () => {
    const participationToEdit = {
      slug: participationFromLea.slug,
      eventDate: participationFromLea.eventDate,
      participantId: lea.id,
      charisma: 200,
    };
    it("should update the participation with the new Charisma", async () => {
      const updated = await takePart.editParticipation(participationToEdit);
      const expected = { ...participationFromLea, charisma: 200 };
      expect(updated).toEqual(expected);
    });
  });
});
