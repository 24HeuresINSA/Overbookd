import { NuxtAxiosInstance } from "@nuxtjs/axios";
import {
  CharismaPeriod,
  SavedCharismaPeriod,
} from "~/utils/models/charismaPeriod";
import { HttpStringified } from "~/utils/types/http";

export type Context = { $axios: NuxtAxiosInstance };

export class CharismaPeriodRepository {
  private static readonly basePath = "charisma-period";

  static async getCharismaPeriods(context: Context) {
    return context.$axios.get<HttpStringified<SavedCharismaPeriod[]>>(
      `${this.basePath}`
    );
  }

  static async getCharismaPeriod(context: Context, charismaPeriodId: number) {
    return context.$axios.get<HttpStringified<SavedCharismaPeriod>>(
      `${this.basePath}/${charismaPeriodId}`
    );
  }

  static async createCharismaPeriod(
    context: Context,
    charismaPeriod: CharismaPeriod
  ) {
    return context.$axios.post<HttpStringified<SavedCharismaPeriod>>(
      `${this.basePath}`,
      charismaPeriod
    );
  }

  static async updateCharismaPeriod(
    context: Context,
    charismaPeriodId: number,
    charismaPeriod: CharismaPeriod
  ) {
    return context.$axios.put<HttpStringified<SavedCharismaPeriod>>(
      `${this.basePath}/${charismaPeriodId}`,
      charismaPeriod
    );
  }

  static async deleteCharismaPeriod(
    context: Context,
    charismaPeriodId: number
  ) {
    return context.$axios.delete(`${this.basePath}/${charismaPeriodId}`);
  }
}
