import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { MissingAssignmentTask } from "@overbookd/assignment";
import { HttpStringified } from "@overbookd/http";

export type Context = { $axios: NuxtAxiosInstance };

export class TaskToVolunteerRepository {
  private static readonly basePath = "assignments/task-to-volunteer";

  static getTasks(context: Context) {
    return context.$axios.get<HttpStringified<MissingAssignmentTask[]>>(
      `${this.basePath}/tasks`,
    );
  }
}
