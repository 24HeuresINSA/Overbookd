import type {
  CharismaEventDefinition,
  CharismaEventParticipation,
  EditCharismaEventParticipation,
  ParticipantTakingPartInCharismaEvent,
} from "@overbookd/charisma";
import type { CharismaEventPotentialParticipant } from "@overbookd/http";
import { updateItemToList } from "@overbookd/list";
import type { User } from "@overbookd/user";
import { CharismaEventRepository } from "~/repositories/charisma/charisma-event.repository";
import { isHttpError } from "~/utils/http/http-error.utils";

type State = {
  allParticipations: CharismaEventParticipation[];
  potentialParticipants: CharismaEventPotentialParticipant[];
};

export const useCharismaEventStore = defineStore("charisma-event", {
  state: (): State => ({
    allParticipations: [],
    potentialParticipants: [],
  }),
  actions: {
    async fetchAllParticipations() {
      const res = await CharismaEventRepository.fetchAllParticipations();
      if (isHttpError(res)) return;
      this.allParticipations = res;
    },

    async fetchPotentialParticipants() {
      const res = await CharismaEventRepository.fetchPotentialParticipants();
      if (isHttpError(res)) return;
      this.potentialParticipants = res;
    },

    async addParticipations(
      event: CharismaEventDefinition,
      participants: ParticipantTakingPartInCharismaEvent[],
    ) {
      const res = await CharismaEventRepository.addParticipations(
        event,
        participants,
      );
      if (isHttpError(res)) return;
      sendSuccessNotification(
        `Les participants ont été ajoutés à l'événement ${event.name}`,
      );
      this.fetchPotentialParticipants();
    },

    async editParticipation(participation: EditCharismaEventParticipation) {
      const res =
        await CharismaEventRepository.editParticipation(participation);
      if (isHttpError(res)) return;

      const { slug, name, eventDate, participant } = res;
      sendSuccessNotification(
        `La participation de ${participant.firstname} à ${name} a été modifiée`,
      );

      const index = this._findParticipationIndex(slug, eventDate, participant);
      if (index === undefined) return;
      this.allParticipations = updateItemToList(
        this.allParticipations,
        index,
        res,
      );
    },

    async removeParticipation(participation: CharismaEventParticipation) {
      const { slug, name, eventDate, participant } = participation;
      const res = await CharismaEventRepository.removeParticipation(
        slug,
        eventDate,
        participant.id,
      );
      if (isHttpError(res)) return;
      sendSuccessNotification(
        `La participation de ${participant.firstname} à ${name} a été supprimée`,
      );

      const index = this._findParticipationIndex(slug, eventDate, participant);
      if (index === undefined) return;
      this.allParticipations.splice(index, 1);
    },

    _findParticipationIndex(
      slug: string,
      eventDate: string,
      participant: User,
    ): number | undefined {
      return this.allParticipations.findIndex(
        (p) =>
          p.slug === slug &&
          p.eventDate === eventDate &&
          p.participant.id === participant.id,
      );
    },
  },
});
