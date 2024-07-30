import type {
  CharismaEventDefinition,
  ParticipantTakingPartInCharismaEvent,
} from "@overbookd/charisma";
import type { CharismaEventPotentialParticipant } from "@overbookd/http";
import { isHttpError } from "~/utils/http/api-fetch";

type State = {
  potentialParticipants: CharismaEventPotentialParticipant[];
};

export const useCharismaEventStore = defineStore("charisma-event", {
  state: (): State => ({
    potentialParticipants: [],
  }),
  actions: {
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
    },
  },
});
