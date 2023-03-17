import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { Volunteer } from "~/utils/models/assignment";
import { HttpStringified } from "~/utils/types/http";

export type Context = { $axios: NuxtAxiosInstance };

export class AssignmentRepository {
  private static readonly basePath = "assignments";

  static async getVolunteers(context: Context) {
    return context.$axios.get<HttpStringified<Volunteer[]>>(
      `${this.basePath}/volunteers`
    );
  }
}
