import { NuxtAxiosInstance } from "@nuxtjs/axios";
import {
  CharismaPeriodCreation,
  CharismaPeriodUpdate,
  SavedCharismaPeriod,
} from "~/utils/models/charismaPeriod";
import { HttpStringified } from "~/utils/types/http";

export type Context = { $axios: NuxtAxiosInstance };

export class CharismaPeriodRepository {
  private static readonly basePath = "/charisma-period";

  static async createCharismaPeriod(
    context: Context,
    charismaPeriod: CharismaPeriodCreation
  ) {
    return context.$axios.post<HttpStringified<SavedCharismaPeriod>>(
      `${this.basePath}`,
      charismaPeriod
    );
  }

  static async updateCharismaPeriod(
    context: Context,
    charismaPeriod: CharismaPeriodUpdate
  ) {
    return context.$axios.patch<HttpStringified<SavedCharismaPeriod>>(
      `${this.basePath}/${charismaPeriod.id}}`,
      charismaPeriod
    );
  }

  static async deleteCharismaPeriod(context: Context, cpId: number) {
    return context.$axios.delete(`${this.basePath}/${cpId}}`);
  }
}
