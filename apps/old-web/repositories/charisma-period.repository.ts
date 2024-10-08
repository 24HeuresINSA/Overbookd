import {
  CharismaPeriod,
  HttpStringified,
  SavedCharismaPeriod,
} from "@overbookd/http";
import { Context } from "../utils/api/axios";

export class CharismaPeriodRepository {
  private static readonly basePath = "charisma-period";

  static async getCharismaPeriods(context: Context) {
    return context.$axios.get<HttpStringified<SavedCharismaPeriod[]>>(
      `${this.basePath}`,
    );
  }

  static async getCharismaPeriod(context: Context, charismaPeriodId: number) {
    return context.$axios.get<HttpStringified<SavedCharismaPeriod>>(
      `${this.basePath}/${charismaPeriodId}`,
    );
  }

  static async createCharismaPeriod(
    context: Context,
    charismaPeriod: CharismaPeriod,
  ) {
    return context.$axios.post<HttpStringified<SavedCharismaPeriod>>(
      `${this.basePath}`,
      charismaPeriod,
    );
  }

  static async updateCharismaPeriod(
    context: Context,
    charismaPeriodId: number,
    charismaPeriod: CharismaPeriod,
  ) {
    return context.$axios.put<HttpStringified<SavedCharismaPeriod>>(
      `${this.basePath}/${charismaPeriodId}`,
      charismaPeriod,
    );
  }

  static async deleteCharismaPeriod(
    context: Context,
    charismaPeriodId: number,
  ) {
    return context.$axios.delete(`${this.basePath}/${charismaPeriodId}`);
  }
}
