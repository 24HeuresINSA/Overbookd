import { DuringBreakPeriods, HttpStringified } from "@overbookd/http";
import { Context } from "./context";
import { IProvidePeriod } from "@overbookd/period";

export class PlanningRepository {
  private static readonly basePath = "planning";

  static getBreakPeriods(context: Context, volunteer: number) {
    return context.$axios.get<HttpStringified<IProvidePeriod[]>>(
      `${this.basePath}/${volunteer}/break-periods`,
    );
  }

  static addBreakPeriod(
    context: Context,
    volunteer: number,
    during: DuringBreakPeriods,
  ) {
    return context.$axios.post<HttpStringified<IProvidePeriod[]>>(
      `${this.basePath}/${volunteer}/break-periods`,
      { ...during },
    );
  }
}
