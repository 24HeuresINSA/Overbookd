import type {
  CharismaEventDefinition,
  CharismaEventParticipation,
  ParticipantTakingPartInCharismaEvent,
} from "@overbookd/charisma";
import type { CharismaEventPotentialParticipant } from "@overbookd/http";
import { HttpClient } from "~/utils/http/http-client";

export class CharismaEventRepository {
  private static readonly basePath = "charisma-events";

  static async fetchPotentialParticipants() {
    return HttpClient.get<CharismaEventPotentialParticipant[]>(
      `${this.basePath}/potential-participants`,
    );
  }

  static async addParticipations(
    event: CharismaEventDefinition,
    participants: ParticipantTakingPartInCharismaEvent[],
  ) {
    return HttpClient.post<CharismaEventParticipation[]>(`${this.basePath}`, {
      event,
      participants,
    });
  }
}
