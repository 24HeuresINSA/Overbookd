import type { CharismaPeriod, SavedCharismaPeriod } from "@overbookd/http";
import { HttpClient } from "~/utils/http/http-client";

export class CharismaPeriodRepository {
  private static readonly basePath = "charisma-periods";

  static async getCharismaPeriods() {
    return HttpClient.get<SavedCharismaPeriod[]>(`${this.basePath}`);
  }

  static async getCharismaPeriod(charismaPeriodId: number) {
    return HttpClient.get<SavedCharismaPeriod>(
      `${this.basePath}/${charismaPeriodId}`,
    );
  }

  static async createCharismaPeriod(charismaPeriod: CharismaPeriod) {
    return HttpClient.post<SavedCharismaPeriod>(
      `${this.basePath}`,
      charismaPeriod,
    );
  }

  static async updateCharismaPeriod(
    charismaPeriodId: number,
    charismaPeriod: CharismaPeriod,
  ) {
    return HttpClient.put<SavedCharismaPeriod>(
      `${this.basePath}/${charismaPeriodId}`,
      charismaPeriod,
    );
  }

  static async deleteCharismaPeriod(charismaPeriodId: number) {
    return HttpClient.delete(`${this.basePath}/${charismaPeriodId}`);
  }
}
