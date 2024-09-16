import type {
  HttpStringified,
  OrgaNeedDetails,
  OrgaNeedRequest,
} from "@overbookd/http";
import type { IProvidePeriod } from "@overbookd/time";
import { isHttpError } from "~/utils/http/api-fetch";
import { castPeriodWithDate } from "~/utils/http/period";

type State = {
  stats: OrgaNeedDetails[];
};

export const useOrgaNeedStore = defineStore("orga-need", {
  state: (): State => ({
    stats: [],
  }),
  actions: {
    async fetchStats(period: IProvidePeriod, teams: string[]) {
      const params: OrgaNeedRequest = { ...period, teams };
      const res = await OrgaNeedRepository.fetchStats(params);
      if (isHttpError(res)) return;
      this.stats = castStatsWithDate(res);
    },
  },
});

function castStatsWithDate(
  stats: HttpStringified<OrgaNeedDetails[]>,
): OrgaNeedDetails[] {
  return stats.map((stat) => ({
    ...stat,
    ...castPeriodWithDate(stat),
  }));
}
