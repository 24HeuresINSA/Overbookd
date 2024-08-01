import type {
  CharismaEventDefinition,
  CharismaEventParticipation,
  ParticipantTakingPartInCharismaEvent,
} from "@overbookd/charisma";
import type { CharismaEventPotentialParticipant } from "@overbookd/http";
import { isHttpError } from "~/utils/http/api-fetch";

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
        `Les participants ont bien été ajoutés à l'événement ${event.name} ✅`,
      );
      this.fetchPotentialParticipants();
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
        `La participation de ${participant.firstname} à ${name} a bien été supprimée ✅`,
      );
      this.fetchAllParticipations();
    },
  },
});
