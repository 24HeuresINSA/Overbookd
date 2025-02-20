import type {
  GearDetails,
  GearPreview,
  GearSearchOptions,
  GearWithDetails,
  HttpStringified,
} from "@overbookd/http";
import { LogisticDashboardRepository } from "~/repositories/logistic/logistic-dashboard.repository";
import { isHttpError } from "~/utils/http/http-error.utils";
import { castPeriodWithDate } from "~/utils/http/cast-date/period.utils";

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
    async fetchPreviews(searchOptions?: GearSearchOptions) {
      const res = await LogisticDashboardRepository.getPreviews(searchOptions);
      if (isHttpError(res)) return;
      this.previews = res;
    },

    async fetchDetails(slug: string, start: Date, end: Date) {
      const res = await LogisticDashboardRepository.getDetails(
        slug,
        start,
        end,
      );
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
