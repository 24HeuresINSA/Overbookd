import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { VolunteerWithAssignmentDuration } from "@overbookd/assignment";
import { HttpStringified } from "@overbookd/http";

export type Context = { $axios: NuxtAxiosInstance };

export class VolunteerToTaskRepository {
  private static readonly basePath = "assignments/volunteer-to-task";

  static getVolunteers(context: Context) {
    return context.$axios.get<
      HttpStringified<VolunteerWithAssignmentDuration[]>
    >(`${this.basePath}/volunteers`);
  }
}
