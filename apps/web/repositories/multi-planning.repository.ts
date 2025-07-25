import type { HelpingVolunteer } from "@overbookd/http";
import { HttpClient } from "~/utils/http/http-client";

export class MultiPlanningRepository {
  private static readonly basePath = "multi-planning";

  static getVolunteers(volunteerIds: number[]) {
    return HttpClient.get<HelpingVolunteer[]>({
      path: this.basePath,
      params: { volunteerIds },
    });
  }
}
