import type {
  CharismaEventDefinition,
  CharismaEventParticipation,
  EditCharismaEventParticipation,
  ParticipantTakingPartInCharismaEvent,
} from "@overbookd/charisma";
import type { DateString } from "@overbookd/time";
import type { CharismaEventPotentialParticipant } from "@overbookd/http";
import { HttpClient } from "~/utils/http/http-client";

export class CharismaEventRepository {
  private static readonly basePath = "charisma-events";

  static async fetchAllParticipations() {
    return HttpClient.get<CharismaEventParticipation[]>(
      `${this.basePath}/all-participations`,
    );
  }

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

  static async editParticipation(
    participation: EditCharismaEventParticipation,
  ) {
    const { slug, eventDate, participantId, charisma } = participation;
    return HttpClient.patch<CharismaEventParticipation>(
      `${this.basePath}/${slug}/date/${eventDate}/participant/${participantId}`,
      { charisma },
    );
  }

  static async removeParticipation(
    slug: string,
    date: DateString,
    participationId: number,
  ) {
    return HttpClient.delete(
      `${this.basePath}/${slug}/date/${date}/participant/${participationId}`,
    );
  }
}
