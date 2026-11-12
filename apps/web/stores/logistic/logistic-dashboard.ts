import type {
  GearDetails,
  GearPreview,
  GearWithDetails,
  HttpStringified,
} from "@overbookd/http";
import type { GearSearchOptions } from "@overbookd/logistic";
import { LogisticDashboardRepository } from "~/repositories/logistic/logistic-dashboard.repository";
import { isHttpError } from "~/utils/http/http-error.utils";
import { castPeriodWithDate } from "~/utils/http/cast-date/period.utils";
import type { IProvidePeriod } from "@overbookd/time";

type State = {
  previews: GearPreview[];
  selectedGear?: GearWithDetails;
  csvRequirements?: string;
};

export const useLogisticDashboardStore = defineStore("logistic-dashboard", {
  state: (): State => ({
    previews: [],
    selectedGear: undefined,
  }),
  actions: {
    async fetchPreviews(
      period: IProvidePeriod,
      searchOptions?: GearSearchOptions,
    ) {
      const res = await LogisticDashboardRepository.getPreviews(
        period,
        searchOptions,
      );
      if (isHttpError(res)) return;
      this.previews = res;
    },

    async fetchDetails(slug: string, period: IProvidePeriod) {
      const res = await LogisticDashboardRepository.getDetails(slug, period);
      if (isHttpError(res)) return;
      const details = res.details.map(castGearDetailsWithDate);
      this.selectedGear = { ...res, details };
    },

    async fetchCSVRequirements() {
      const res = await LogisticDashboardRepository.getCSVRequirements();
      if (isHttpError(res)) return;
      this.csvRequirements = res;
    },
  },
});

function castGearDetailsWithDate(
  details: HttpStringified<GearDetails>,
): GearDetails {
  return {
    ...details,
    ...castPeriodWithDate(details),
  };
}
